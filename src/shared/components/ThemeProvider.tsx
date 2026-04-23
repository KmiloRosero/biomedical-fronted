import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useThemeStore } from "@/core/stores/useThemeStore";

export function ThemeProvider({ children }: PropsWithChildren) {
  const initialize = useThemeStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}
