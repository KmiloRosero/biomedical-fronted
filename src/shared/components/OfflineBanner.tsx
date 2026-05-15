import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfflineBanner({ className }: { className?: string }) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className={cn(
        "mx-4 mt-4 flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-900 dark:border-amber-200/20 dark:bg-amber-400/10 dark:text-amber-100",
        className
      )}
      role="status"
    >
      <WifiOff className="h-5 w-5" />
      <div className="text-sm">
        Sin conexión. El sistema puede funcionar en modo demo, pero las llamadas al backend pueden fallar.
      </div>
    </div>
  );
}

