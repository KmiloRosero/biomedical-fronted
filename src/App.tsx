import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { OAuthCallbackPage } from "@/features/auth/pages/OAuthCallbackPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { DashboardLayout } from "@/features/dashboard/layout/DashboardLayout";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { NetworkProvider } from "@/shared/components/NetworkProvider";
import { ThemeProvider } from "@/shared/components/ThemeProvider";
import { AppErrorBoundary } from "@/shared/components/AppErrorBoundary";
import { AccessDeniedPage, NotFoundPage, OfflinePage } from "@/shared/pages/SystemPages";
import { RequireRole } from "@/features/auth/components/RequireRole";

const DashboardAnalyticsPage = lazy(() =>
  import("@/features/dashboard/pages/DashboardAnalyticsPage").then((m) => ({
    default: m.DashboardAnalyticsPage,
  }))
);

const DashboardHomePage = lazy(() =>
  import("@/features/dashboard/pages/DashboardHomePage").then((m) => ({
    default: m.DashboardHomePage,
  }))
);

const ProjectOverviewPage = lazy(() =>
  import("@/features/dashboard/pages/ProjectOverviewPage").then((m) => ({
    default: m.ProjectOverviewPage,
  }))
);

const OperationsCenterPage = lazy(() =>
  import("@/features/operationsCenter/pages/OperationsCenterPage").then((m) => ({
    default: m.OperationsCenterPage,
  }))
);

const TraceabilityPage = lazy(() =>
  import("@/features/traceability/pages/TraceabilityPage").then((m) => ({
    default: m.TraceabilityPage,
  }))
);

const WastePage = lazy(() =>
  import("@/features/waste/pages/WastePage").then((m) => ({
    default: m.WastePage,
  }))
);

const RoutesPage = lazy(() =>
  import("@/features/routes/pages/RoutesPage").then((m) => ({
    default: m.RoutesPage,
  }))
);

const AlertsPage = lazy(() =>
  import("@/features/alerts/pages/AlertsPage").then((m) => ({
    default: m.AlertsPage,
  }))
);

const ReportsPage = lazy(() =>
  import("@/features/reports/pages/ReportsPage").then((m) => ({
    default: m.ReportsPage,
  }))
);

const SystemMonitorPage = lazy(() =>
  import("@/features/systemMonitor/pages/SystemMonitorPage").then((m) => ({
    default: m.SystemMonitorPage,
  }))
);

const SettingsPage = lazy(() =>
  import("@/features/settings/pages/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  }))
);

const MunicipalitiesPage = lazy(() =>
  import("@/features/admin/pages/MunicipalitiesPage").then((m) => ({
    default: m.MunicipalitiesPage,
  }))
);

const WasteTypesPage = lazy(() =>
  import("@/features/admin/pages/WasteTypesPage").then((m) => ({
    default: m.WasteTypesPage,
  }))
);

const TransportFleetPage = lazy(() =>
  import("@/features/admin/pages/TransportFleetPage").then((m) => ({
    default: m.TransportFleetPage,
  }))
);

const AuditLogPage = lazy(() =>
  import("@/features/audit/pages/AuditLogPage").then((m) => ({
    default: m.AuditLogPage,
  }))
);

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <Router>
      <ThemeProvider>
        <NetworkProvider>
          <AppErrorBoundary>
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
              <Route path="/" element={<EntryRedirect />} />
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
                <Route
                  path="home"
                  element={
                    <Suspense fallback={<RouteFallback label="Cargando inicio..." />}>
                      <DashboardHomePage />
                    </Suspense>
                  }
                />
                <Route
                  path="about"
                  element={
                    <Suspense fallback={<RouteFallback label="Cargando descripción..." />}>
                      <ProjectOverviewPage />
                    </Suspense>
                  }
                />
                <Route path="offline" element={<OfflinePage />} />
                <Route path="forbidden" element={<AccessDeniedPage />} />
                <Route
                  path="operations"
                  element={
                    <RequireRole allowed={["admin", "operador"]}>
                      <Suspense fallback={<RouteFallback label="Cargando operaciones..." />}>
                        <OperationsCenterPage />
                      </Suspense>
                    </RequireRole>
                  }
                />
                <Route
                  path="traceability"
                  element={
                    <Suspense fallback={<RouteFallback label="Cargando trazabilidad..." />}>
                      <TraceabilityPage />
                    </Suspense>
                  }
                />
                <Route
                  path="waste"
                  element={
                    <RequireRole allowed={["admin", "operador", "auditor"]}>
                      <Suspense fallback={<RouteFallback label="Cargando residuos..." />}>
                        <WastePage />
                      </Suspense>
                    </RequireRole>
                  }
                />
                <Route
                  path="routes"
                  element={
                    <Suspense fallback={<RouteFallback label="Cargando rutas..." />}>
                      <RoutesPage />
                    </Suspense>
                  }
                />
                <Route
                  path="alerts"
                  element={
                    <Suspense fallback={<RouteFallback label="Cargando alertas..." />}>
                      <AlertsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <RequireRole allowed={["admin", "operador", "auditor"]}>
                      <Suspense fallback={<RouteFallback label="Cargando reportes..." />}>
                        <ReportsPage />
                      </Suspense>
                    </RequireRole>
                  }
                />
                <Route
                  path="system-monitor"
                  element={
                    <RequireRole allowed={["admin", "auditor"]}>
                      <Suspense fallback={<RouteFallback label="Cargando estabilidad..." />}>
                        <SystemMonitorPage />
                      </Suspense>
                    </RequireRole>
                  }
                />
                <Route
                  path="audit"
                  element={
                    <RequireRole allowed={["admin", "auditor"]}>
                      <Suspense fallback={<RouteFallback label="Cargando bitácora..." />}>
                        <AuditLogPage />
                      </Suspense>
                    </RequireRole>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<RouteFallback label="Cargando configuración..." />}>
                      <SettingsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="admin/municipalities"
                  element={
                    <RequireRole allowed={["admin"]}>
                      <Suspense fallback={<RouteFallback label="Cargando municipios..." />}>
                        <MunicipalitiesPage />
                      </Suspense>
                    </RequireRole>
                  }
                />
                <Route
                  path="admin/waste-types"
                  element={
                    <RequireRole allowed={["admin"]}>
                      <Suspense fallback={<RouteFallback label="Cargando tipos..." />}>
                        <WasteTypesPage />
                      </Suspense>
                    </RequireRole>
                  }
                />
                <Route
                  path="admin/transport-fleet"
                  element={
                    <RequireRole allowed={["admin"]}>
                      <Suspense fallback={<RouteFallback label="Cargando flota..." />}>
                        <TransportFleetPage />
                      </Suspense>
                    </RequireRole>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
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
              <Route path="*" element={<EntryRedirect />} />
            </Routes>
          </AppErrorBoundary>
        </NetworkProvider>
      </ThemeProvider>
    </Router>
  );
}

function EntryRedirect() {
  return <Navigate to="/login" replace />;
}

function RouteFallback({ label }: { label: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center text-slate-900 dark:text-white">
      <div className="text-slate-700 dark:text-white/70">{label}</div>
    </div>
  );
}
