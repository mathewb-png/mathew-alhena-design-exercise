import { Outlet } from "react-router-dom";
import { clsx } from "clsx";
import { Scenario1Sidebar } from "./Scenario1Sidebar";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";

function Scenario1Content() {
  const { darkMode } = useTheme();
  return (
    <div className={clsx("min-h-screen bg-surface-50 transition-colors duration-300", darkMode && "dark")}>
      <Scenario1Sidebar />
      <main className="ml-[240px] p-8 max-w-[1440px]">
        <Outlet />
      </main>
    </div>
  );
}

export function Scenario1Shell() {
  return (
    <ThemeProvider>
      <Scenario1Content />
    </ThemeProvider>
  );
}
