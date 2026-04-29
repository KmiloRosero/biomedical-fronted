import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { OAuthCallbackPage } from "@/features/auth/pages/OAuthCallbackPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { DashboardLayout } from "@/features/dashboard/layout/DashboardLayout";
import { DashboardHomePage } from "@/features/dashboard/pages/DashboardHomePage";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { NetworkProvider } from "@/shared/components/NetworkProvider";
import { ThemeProvider } from "@/shared/components/ThemeProvider";
import { OperationsCenterPage } from "@/features/operationsCenter/pages/OperationsCenterPage";
import { SystemMonitorPage } from "@/features/systemMonitor/pages/SystemMonitorPage";
import { TraceabilityPage } from "@/features/traceability/pages/TraceabilityPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { MunicipalitiesPage } from "@/features/admin/pages/MunicipalitiesPage";
import { WasteTypesPage } from "@/features/admin/pages/WasteTypesPage";
import { TransportFleetPage } from "@/features/admin/pages/TransportFleetPage";

const DashboardAnalyticsPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardAnalyticsPage").then((m) => ({
    default: m.DashboardAnalyticsPage,
  }))
);

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <ThemeProvider>
        <NetworkProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(2,6,23,0.92)",
                color: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(255,255,255,0.12)",
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<OAuthCallbackPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<RouteFallback label="Cargando dashboard..." />}>
                <DashboardAnalyticsPage />
              </Suspense>
            }
          />
          <Route path="home" element={<DashboardHomePage />} />
          <Route path="operations" element={<OperationsCenterPage />} />
          <Route path="traceability" element={<TraceabilityPage />} />
          <Route path="system-monitor" element={<SystemMonitorPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin/municipalities" element={<MunicipalitiesPage />} />
          <Route path="admin/waste-types" element={<WasteTypesPage />} />
          <Route path="admin/transport-fleet" element={<TransportFleetPage />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Navigate to="/app/dashboard" replace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Navigate to="/app/settings" replace />
            </ProtectedRoute>
          }
        />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </NetworkProvider>
      </ThemeProvider>
    </Router>
  );
}

function RouteFallback({ label }: { label: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center text-slate-900 dark:text-white">
      <div className="text-slate-700 dark:text-white/70">{label}</div>
    </div>
  );
}
