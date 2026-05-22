import { Outlet } from "react-router-dom";
import { clsx } from "clsx";
import { Scenario2Sidebar } from "./Scenario2Sidebar";
import { OnboardingProvider } from "../../context/OnboardingContext";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";
import { StepCompleteNotification } from "../common/StepCompleteNotification";

function Scenario2Content() {
  const { darkMode } = useTheme();
  return (
    <div className={clsx("min-h-screen bg-surface-50 transition-colors duration-300", darkMode && "dark")}>
      <Scenario2Sidebar />
      <main className="ml-[240px] p-8 max-w-[1440px]">
        <Outlet />
      </main>
      <StepCompleteNotification />
    </div>
  );
}

export function Scenario2Shell() {
  return (
    <ThemeProvider>
      <OnboardingProvider>
        <Scenario2Content />
      </OnboardingProvider>
    </ThemeProvider>
  );
}
