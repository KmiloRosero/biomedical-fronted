import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { TopHeader } from "../components/TopHeader";
import { AiAssistantWidget } from "@/features/aiAssistant/components/AiAssistantWidget";
import { DemoBanner } from "@/shared/components/DemoBanner";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <DemoBanner />
          <TopHeader />
          <main className="p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <AiAssistantWidget />
    </div>
  );
}
