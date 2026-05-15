import { LogOut, Menu, Moon, Settings, Sun, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/Button";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { useUiStore } from "@/core/stores/useUiStore";
import { useThemeStore } from "@/core/stores/useThemeStore";
import { getRoleLabel, useRoleStore } from "@/core/stores/useRoleStore";

export function TopHeader() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();
  const toggleMobileSidebar = useUiStore((s) => s.toggleMobileSidebar);
  const themeMode = useThemeStore((s) => s.mode);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const role = useRoleStore((s) => s.role);

  return (
    <header className="sticky top-0 z-10 h-16 border-b border-slate-200/70 bg-white/70 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/80 shadow-sm">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl hover:bg-slate-900/5 dark:hover:bg-white/10 lg:hidden transition-all duration-200"
            onClick={toggleMobileSidebar}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-slate-900 dark:text-white tracking-tight"
          >
            Residuos Biomédicos
          </motion.h1>
          <div className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/30">
            KB
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          >
            {themeMode === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all"
            onClick={() => navigate("/app/settings")}
            aria-label="Abrir configuración"
          >
            <Settings className="h-6 w-6" />
          </motion.button>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-900/5 px-4 py-2.5 text-sm text-slate-700 dark:bg-white/5 dark:text-white/80">
            <UserCircle2 className="h-6 w-6" />
            <span className="max-w-[240px] truncate font-medium">{user?.email ?? "Sin usuario"}</span>
            <span className="hidden h-6 w-px bg-slate-300/70 dark:bg-white/15 sm:inline-block" />
            <span className="hidden px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 text-xs font-semibold sm:inline-block">
              {getRoleLabel(role)}
            </span>
          </div>
          <Button type="button" variant="secondary" onClick={signOut} className="h-12 px-5 gap-2 text-base">
            <LogOut className="h-5 w-5" />
            Salir
          </Button>
        </div>
      </div>
    </header>
  );
}
