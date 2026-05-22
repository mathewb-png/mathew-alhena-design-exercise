import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Scenario1Shell } from "./components/layout/Scenario1Shell";
import { Scenario2Shell } from "./components/layout/Scenario2Shell";
import { LandingPage } from "./pages/LandingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DrilldownPage } from "./pages/DrilldownPage";
import { AnomalyPage } from "./pages/AnomalyPage";
import { SettingsPage } from "./pages/SettingsPage";
import { HelpPage } from "./pages/HelpPage";
import { LaunchReadinessPage } from "./pages/scenario2/LaunchReadinessPage";
import { IntegrationsPage } from "./pages/scenario2/IntegrationsPage";
import { KnowledgeBasePage } from "./pages/scenario2/KnowledgeBasePage";
import { PreviewDashboardPage } from "./pages/scenario2/PreviewDashboardPage";
import { TeamPage } from "./pages/scenario2/TeamPage";
import { Scenario2SettingsPage } from "./pages/scenario2/SettingsPage";
import { Scenario2HelpPage } from "./pages/scenario2/HelpPage";
import { ConnectStorePage } from "./pages/scenario2/ConnectStorePage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        {/* Landing - links to both scenarios */}
        <Route path="/" element={<LandingPage />} />

        {/* Scenario 1: Weekly Performance Review (mature account) */}
        <Route path="/scenario-1" element={<Scenario1Shell />}>
          <Route index element={<DashboardPage />} />
          <Route path="drilldown" element={<DrilldownPage />} />
          <Route path="alerts" element={<AnomalyPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="help" element={<HelpPage />} />
        </Route>

        {/* Scenario 2: New Account Onboarding */}
        <Route path="/scenario-2" element={<Scenario2Shell />}>
          <Route index element={<LaunchReadinessPage />} />
          <Route path="connect-store" element={<ConnectStorePage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="knowledge" element={<KnowledgeBasePage />} />
          <Route path="preview" element={<PreviewDashboardPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="settings" element={<Scenario2SettingsPage />} />
          <Route path="help" element={<Scenario2HelpPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
);
