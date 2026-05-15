import type { PropsWithChildren } from "react";
import type { AppRole } from "@/core/stores/useRoleStore";
import { Navigate } from "react-router-dom";
import { useRoleStore } from "@/core/stores/useRoleStore";

export function RequireRole({
  allowed,
  children,
}: PropsWithChildren<{ allowed: AppRole[] }>) {
  const role = useRoleStore((s) => s.role);

  if (allowed.includes(role)) {
    return <>{children}</>;
  }

  return <Navigate to="/app/forbidden" replace />;
}

