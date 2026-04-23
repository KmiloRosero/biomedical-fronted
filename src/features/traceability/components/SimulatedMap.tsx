import { motion } from "framer-motion";
import { Building2, Factory, Hospital, MapPin, Truck } from "lucide-react";

type MapPoint = {
  id: string;
  label: string;
  left: string;
  top: string;
  icon: React.ReactNode;
};

export type SimulatedMapProps = {
  isTracking: boolean;
  animationKey: number;
};

export function SimulatedMap({ isTracking, animationKey }: SimulatedMapProps) {
  const points: MapPoint[] = [
    { id: "hospital", label: "Hospital", left: "10%", top: "18%", icon: <Hospital className="h-4 w-4" /> },
    { id: "hub", label: "Centro de Recolección", left: "30%", top: "60%", icon: <Building2 className="h-4 w-4" /> },
    { id: "plant", label: "Planta de Tratamiento", left: "68%", top: "62%", icon: <Factory className="h-4 w-4" /> },
    { id: "disposal", label: "Disposición Final", left: "84%", top: "22%", icon: <MapPin className="h-4 w-4" /> },
  ];

  const pathLeft = points.map((p) => p.left);
  const pathTop = points.map((p) => p.top);

  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 dark:border-white/10 dark:bg-slate-950"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,23,42,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.10) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10" />

      <div className="absolute inset-0">
        {points.map((p) => (
          <div
            key={p.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: p.left, top: p.top }}
          >
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-2xl border border-slate-200/70 bg-white/80 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                {p.icon}
              </div>
              <div className="hidden sm:block rounded-xl bg-white/80 px-2 py-1 text-xs text-slate-700 dark:bg-black/40 dark:text-white/70">
                {p.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <motion.div
        key={animationKey}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        initial={{ left: points[0]!.left, top: points[0]!.top }}
        animate={
          isTracking
            ? { left: pathLeft, top: pathTop }
            : { left: points[0]!.left, top: points[0]!.top }
        }
        transition={
          isTracking
            ? { duration: 7.5, ease: "easeInOut", times: [0, 0.34, 0.68, 1] }
            : { duration: 0.2 }
        }
        style={{ willChange: "left, top" }}
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-400/30 bg-emerald-500/15 text-emerald-700 shadow-lg shadow-emerald-500/10 dark:text-emerald-100">
          <Truck className="h-6 w-6" />
        </div>
      </motion.div>
    </div>
  );
}
