import type { PropsWithChildren } from "react";
import type { AppRole } from "@/core/stores/useRoleStore";
import { Navigate } from "react-router-dom";
import { isRbacEnabled, useRoleStore } from "@/core/stores/useRoleStore";
import { isDemoMode } from "@/core/config/flags";

export function RequireRole({
  allowed,
  children,
}: PropsWithChildren<{ allowed: AppRole[] }>) {
  const role = useRoleStore((s) => s.role);

  if (isDemoMode() || !isRbacEnabled()) {
    return <>{children}</>;
  }

  if (allowed.includes(role)) {
    return <>{children}</>;
  }

  return <Navigate to="/app/forbidden" replace />;
}
