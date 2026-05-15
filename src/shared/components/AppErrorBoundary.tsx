import type { ReactNode } from "react";
import { Component } from "react";
import { Surface } from "@/shared/ui/Surface";
import { Button } from "@/shared/ui/Button";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  override state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-white">
          <Surface className="w-full max-w-xl p-6">
            <div className="text-lg font-semibold">Ocurrió un error inesperado</div>
            <div className="mt-2 text-sm text-slate-700 dark:text-white/70">
              Puedes recargar la página para continuar. Si persiste, revisa la consola o vuelve a intentar más tarde.
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Button type="button" onClick={() => window.location.reload()}>
                Recargar
              </Button>
              <Button type="button" variant="secondary" onClick={() => this.setState({ hasError: false })}>
                Intentar de nuevo
              </Button>
            </div>
          </Surface>
        </div>
      );
    }

    return this.props.children;
  }
}
