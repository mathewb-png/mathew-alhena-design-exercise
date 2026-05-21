import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { DrilldownPage } from "./pages/DrilldownPage";
import { AnomalyPage } from "./pages/AnomalyPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/drilldown" element={<DrilldownPage />} />
          <Route path="/anomaly" element={<AnomalyPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>
);
