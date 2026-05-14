import { isDemoMode } from "@/core/config/flags";

export function DemoBanner() {
  if (!isDemoMode()) {
    return null;
  }

  return (
    <div className="border-b border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-900 dark:text-amber-100 sm:px-6">
      Modo demostración activo: acceso sin login.
    </div>
  );
}
