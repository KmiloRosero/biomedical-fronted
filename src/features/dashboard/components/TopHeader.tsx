import { LogOut, Menu, Moon, Settings, Sun, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
    <header className="sticky top-0 z-10 h-14 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="flex h-full items-center justify-between gap-3 px-3 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-900/5 dark:hover:bg-white/10 lg:hidden"
            onClick={toggleMobileSidebar}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-900/5 dark:hover:bg-white/10"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
          >
            {themeMode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-900/5 dark:hover:bg-white/10"
            onClick={() => navigate("/app/settings")}
            aria-label="Abrir configuración"
          >
            <Settings className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 rounded-xl bg-slate-900/5 px-3 py-1.5 text-sm text-slate-700 dark:bg-white/5 dark:text-white/80">
            <UserCircle2 className="h-5 w-5" />
            <span className="max-w-[200px] truncate">{user?.email ?? "Sin usuario"}</span>
            <span className="hidden h-5 w-px bg-slate-300/70 dark:bg-white/15 sm:inline-block" />
            <span className="hidden text-xs font-semibold text-slate-600 dark:text-white/70 sm:inline-block">
              {getRoleLabel(role)}
            </span>
          </div>
        <Button type="button" variant="secondary" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
        </div>
      </div>
    </header>
  );
}
