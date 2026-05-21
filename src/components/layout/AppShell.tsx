import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  return (
    <div className="min-h-screen bg-surface-50">
      <Sidebar />
      <main className="ml-[240px] p-8 max-w-[1440px]">
        <Outlet />
      </main>
    </div>
  );
}
