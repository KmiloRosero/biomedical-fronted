import { useMemo } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  ClipboardList,
  Lock,
  Route,
  LayoutGrid,
  MapPinned,
  MessageSquareText,
  Recycle,
  BarChart3,
  FileBarChart2,
  Settings,
  Workflow,
  Truck,
  Info,
  ScrollText,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/core/stores/useUiStore";
import { useAiAssistantStore } from "@/features/aiAssistant/stores/useAiAssistantStore";
import { useRoleStore, type AppRole } from "@/core/stores/useRoleStore";

type SidebarItem = {
  to: string;
  label: string;
  icon: ReactNode;
  roles?: AppRole[];
};

export function Sidebar() {
  const isCollapsed = useUiStore((s) => s.isSidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const isMobileOpen = useUiStore((s) => s.isMobileSidebarOpen);
  const closeMobileSidebar = useUiStore((s) => s.closeMobileSidebar);
  const openAssistant = useAiAssistantStore((s) => s.open);
  const role = useRoleStore((s) => s.role);
  const navigate = useNavigate();

  const items = useMemo<SidebarItem[]>(
    () => [
      { to: "/app/about", label: "Acerca", icon: <Info className="h-6 w-6" /> },
      { to: "/app/dashboard", label: "Dashboard", icon: <BarChart3 className="h-6 w-6" /> },
      { to: "/app/home", label: "Inicio", icon: <LayoutGrid className="h-6 w-6" /> },
      {
        to: "/app/operations",
        label: "Operaciones",
        icon: <ClipboardList className="h-6 w-6" />,
        roles: ["admin", "operador"],
      },
      {
        to: "/app/traceability",
        label: "Trazabilidad",
        icon: <Workflow className="h-6 w-6" />,
        roles: ["admin", "operador", "conductor", "auditor"],
      },
      {
        to: "/app/waste",
        label: "Residuos",
        icon: <Recycle className="h-6 w-6" />,
        roles: ["admin", "operador", "auditor"],
      },
      {
        to: "/app/routes",
        label: "Rutas",
        icon: <Route className="h-6 w-6" />,
        roles: ["admin", "operador", "conductor", "auditor"],
      },
      {
        to: "/app/alerts",
        label: "Alertas",
        icon: <Bell className="h-6 w-6" />,
        roles: ["admin", "operador", "conductor", "auditor"],
      },
      {
        to: "/app/reports",
        label: "Reportes",
        icon: <FileBarChart2 className="h-6 w-6" />,
        roles: ["admin", "operador", "auditor"],
      },
      {
        to: "/app/system-monitor",
        label: "Estabilidad",
        icon: <Activity className="h-6 w-6" />,
        roles: ["admin", "auditor"],
      },
      {
        to: "/app/audit",
        label: "Bitácora",
        icon: <ScrollText className="h-6 w-6" />,
        roles: ["admin", "auditor"],
      },
      {
        to: "/app/admin/municipalities",
        label: "Municipios",
        icon: <MapPinned className="h-6 w-6" />,
        roles: ["admin"],
      },
      {
        to: "/app/admin/waste-types",
        label: "Tipos de Residuos",
        icon: <Recycle className="h-6 w-6" />,
        roles: ["admin"],
      },
      {
        to: "/app/admin/transport-fleet",
        label: "Flota",
        icon: <Truck className="h-6 w-6" />,
        roles: ["admin"],
      },
      {
        to: "/app/settings",
        label: "Configuración",
        icon: <Settings className="h-6 w-6" />,
        roles: ["admin", "operador", "conductor", "auditor"],
      },
      {
        to: "/app/assistant",
        label: "Asistente IA",
        icon: <MessageSquareText className="h-6 w-6" />,
        roles: ["admin", "operador", "auditor"],
      },
    ],
    []
  );

  function renderContent(collapsed: boolean, showCollapseToggle: boolean) {
    return (
    <div
      className={cn(
        "h-full border-r border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-white/5",
        collapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      <div className="flex h-14 items-center justify-between px-3">
        <div
          className={cn(
            "truncate text-sm font-semibold text-slate-900 dark:text-white",
            collapsed ? "opacity-0" : "opacity-100"
          )}
        >
          Residuos Biomédicos
        </div>
        <button
          type="button"
          className={cn(
            "rounded-xl p-2 hover:bg-slate-900/5 dark:hover:bg-white/10",
            showCollapseToggle ? "inline-flex" : "hidden"
          )}
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
        >
          {collapsed ? <PanelLeftOpen className="h-6 w-6" /> : <PanelLeftClose className="h-6 w-6" />}
        </button>
      </div>

      <nav className="px-2">
        <ul className="space-y-1">
          {items.map((item) => {
            const isAllowed = !item.roles || item.roles.includes(role);
            return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm transition",
                    isActive
                      ? "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100"
                      : isAllowed
                        ? "text-slate-700 hover:bg-slate-900/5 dark:text-white/80 dark:hover:bg-white/10"
                        : "cursor-not-allowed text-slate-400 dark:text-white/35",
                    collapsed ? "justify-center" : null
                  )
                }
                onClick={(e) => {
                  if (!isAllowed) {
                    e.preventDefault();
                    closeMobileSidebar();
                    navigate("/app/forbidden", { replace: true });
                    return;
                  }
                  if (item.to.endsWith("/assistant")) {
                    e.preventDefault();
                    openAssistant();
                    closeMobileSidebar();
                    return;
                  }
                  closeMobileSidebar();
                }}
              >
                {item.icon}
                {collapsed ? null : (
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate">{item.label}</span>
                    {isAllowed ? null : <Lock className="h-4 w-4 shrink-0 opacity-70" />}
                  </div>
                )}
              </NavLink>
            </li>
          );
          })}
        </ul>
      </nav>
    </div>
    );
  }

  return (
    <>
      <aside className="hidden h-screen lg:block">{renderContent(isCollapsed, true)}</aside>

      <AnimatePresence>
        {isMobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              onClick={closeMobileSidebar}
              aria-label="Cerrar menú"
            />
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative h-full"
            >
              {renderContent(false, false)}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
