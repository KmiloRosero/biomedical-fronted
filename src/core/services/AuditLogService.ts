export type AuditAction = "create" | "update" | "delete" | "view";

export type AuditEvent = {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  summary: string;
};

const storageKey = "biowaste.auditLog";

export class AuditLogService {
  public getAll(): AuditEvent[] {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as AuditEvent[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public append(event: Omit<AuditEvent, "id" | "timestamp" | "actorEmail" | "actorRole"> & Partial<Pick<AuditEvent, "actorEmail" | "actorRole">>) {
    const now = new Date().toISOString();
    const actor = getActor();
    const full: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      timestamp: now,
      actorEmail: event.actorEmail ?? actor.email,
      actorRole: event.actorRole ?? actor.role,
      action: event.action,
      entity: event.entity,
      entityId: event.entityId,
      summary: event.summary,
    };

    const current = this.getAll();
    const next = [full, ...current].slice(0, 400);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  public clear() {
    localStorage.removeItem(storageKey);
  }

  public delete(id: string) {
    const current = this.getAll();
    const next = current.filter((e) => e.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }
}

function getActor() {
  const role = localStorage.getItem("biowaste.role") ?? "admin";
  const rawUser = localStorage.getItem("biowaste.user");
  if (rawUser) {
    try {
      const parsed = JSON.parse(rawUser) as { email?: unknown };
      const email = typeof parsed.email === "string" ? parsed.email : "demo@biowaste.local";
      return { role, email };
    } catch {
      return { role, email: "demo@biowaste.local" };
    }
  }
  return { role, email: "demo@biowaste.local" };
}
