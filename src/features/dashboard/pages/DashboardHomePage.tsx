import { useAuthStore } from "@/features/auth/stores/useAuthStore";

export function DashboardHomePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Panel principal</h2>
      <p className="text-sm text-slate-700 dark:text-white/70">
        Bienvenido{user?.fullName ? `, ${user.fullName}` : ""}.
      </p>
    </div>
  );
}
