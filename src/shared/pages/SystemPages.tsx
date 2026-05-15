import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Ban, Home, SearchX, WifiOff } from "lucide-react";
import { Surface } from "@/shared/ui/Surface";
import { Button } from "@/shared/ui/Button";

export function NotFoundPage() {
  return (
    <SystemPage
      icon={<SearchX className="h-6 w-6" />}
      title="Página no encontrada"
      description="La ruta que estás buscando no existe o fue movida."
      action={
        <Link to="/app/home">
          <Button type="button">
            <Home className="h-4 w-4" />
            Ir a inicio
          </Button>
        </Link>
      }
    />
  );
}

export function AccessDeniedPage() {
  return (
    <SystemPage
      icon={<Ban className="h-6 w-6" />}
      title="Acceso restringido"
      description="Tu rol actual no tiene permiso para ver esta sección."
      action={
        <Link to="/app/home">
          <Button type="button" variant="secondary">
            Volver
          </Button>
        </Link>
      }
    />
  );
}

export function OfflinePage() {
  return (
    <SystemPage
      icon={<WifiOff className="h-6 w-6" />}
      title="Sin conexión"
      description="Verifica tu conexión. En modo demo, puedes seguir navegando con datos locales."
      action={
        <Link to="/app/home">
          <Button type="button">
            <Home className="h-4 w-4" />
            Ir a inicio
          </Button>
        </Link>
      }
    />
  );
}

function SystemPage({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <Surface className="w-full max-w-xl p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200/70 bg-slate-900/5 text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-white">
            {icon}
          </div>
          <div className="min-w-0">
            <div className="text-lg font-semibold text-slate-900 dark:text-white">{title}</div>
            <div className="mt-1 text-sm text-slate-700 dark:text-white/70">{description}</div>
            <div className="mt-5">{action}</div>
          </div>
        </div>
      </Surface>
    </div>
  );
}

