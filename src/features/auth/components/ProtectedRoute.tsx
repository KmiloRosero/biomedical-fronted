import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { isAuthRequired } from "@/core/config/flags";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const status = useAuthStore((s) => s.status);

  if (!isAuthRequired()) {
    return <>{children}</>;
  }

  if (status === "unknown") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="text-slate-700 dark:text-white/80">Cargando...</div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
