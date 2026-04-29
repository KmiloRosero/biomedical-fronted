import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Surface } from "@/shared/ui/Surface";
import { useAuthStore } from "../stores/useAuthStore";
import type { UserProfile } from "../models/UserProfile";

export function OAuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const completeOAuth = useAuthStore((s) => s.completeOAuth);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const token = params.get("token");
  const userRaw = params.get("user");

  useEffect(() => {
    if (!token) {
      return;
    }

    let user: UserProfile | undefined;
    if (userRaw) {
      try {
        user = JSON.parse(userRaw) as UserProfile;
      } catch {
        user = undefined;
      }
    }

    completeOAuth(token, user);
    navigate("/app", { replace: true });
  }, [completeOAuth, navigate, token, userRaw]);

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-900 dark:bg-slate-950 dark:text-white">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="w-full max-w-md">
        <Surface className="p-6 sm:p-8">
          <h1 className="text-lg font-semibold">Finalizando inicio de sesión…</h1>
          {token ? (
            <p className="mt-2 text-sm text-slate-700 dark:text-white/70">Redirigiendo al sistema.</p>
          ) : (
            <p className="mt-2 text-sm text-rose-600 dark:text-rose-200">
              No se recibió token desde el proveedor. Revisa la redirección del backend.
            </p>
          )}
        </Surface>
      </motion.div>
    </div>
  );
}
