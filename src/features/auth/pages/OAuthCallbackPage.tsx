import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Surface } from "@/shared/ui/Surface";
import { useAuthStore } from "../stores/useAuthStore";

export function OAuthCallbackPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const exchangeCodeForSession = useAuthStore((s) => s.exchangeCodeForSession);
  const initialize = useAuthStore((s) => s.initialize);

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const code = params.get("code");
  const errorDescription = params.get("error_description");

  useEffect(() => {
    async function run() {
      if (code) {
        await exchangeCodeForSession(code);
        navigate("/app", { replace: true });
        return;
      }

      await initialize();
      navigate("/app", { replace: true });
    }

    void run();
  }, [code, exchangeCodeForSession, initialize, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-900 dark:bg-slate-950 dark:text-white">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="w-full max-w-md">
        <Surface className="p-6 sm:p-8">
          <h1 className="text-lg font-semibold">Finalizando inicio de sesión…</h1>
          {errorDescription ? (
            <p className="mt-2 text-sm text-rose-600 dark:text-rose-200">{errorDescription}</p>
          ) : (
            <p className="mt-2 text-sm text-slate-700 dark:text-white/70">Redirigiendo al sistema.</p>
          )}
        </Surface>
      </motion.div>
    </div>
  );
}
