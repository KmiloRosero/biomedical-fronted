import { isDemoMode } from "@/core/config/flags";

export function DemoBanner() {
  if (!isDemoMode()) {
    return null;
  }

  return null;
}
