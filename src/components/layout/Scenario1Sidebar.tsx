import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Home,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";
import { useTheme } from "../../context/ThemeContext";

const navItems = [
  { to: "/scenario-1", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/scenario-1/drilldown", icon: BarChart3, label: "Performance" },
  { to: "/scenario-1/alerts", icon: AlertTriangle, label: "Alerts" },
];

const bottomNavItems = [
  { to: "/scenario-1/settings", icon: Settings, label: "Settings" },
  { to: "/scenario-1/help", icon: HelpCircle, label: "Help" },
];

export function Scenario1Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className={clsx(
        "fixed left-0 top-0 h-screen bg-surface-0 border-r border-surface-200 flex flex-col z-50 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <div
        className={clsx(
          "border-b border-surface-100 h-16 flex items-center",
          collapsed ? "flex-col justify-center px-2 py-2 gap-1" : "px-4"
        )}
      >
        {collapsed ? (
          <>
            <div className="w-8 h-8 rounded-full bg-alhena-50 flex items-center justify-center text-xs font-bold text-alhena-700">
              AC
            </div>
            <button
              onClick={() => setCollapsed(false)}
              aria-label="Expand sidebar"
              className="p-1 rounded-md hover:bg-surface-100 transition-colors"
            >
              <ChevronLeft
                size={14}
                className="text-surface-600 rotate-180"
              />
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-alhena-50 flex items-center justify-center text-xs font-bold text-alhena-700 shrink-0">
                AC
              </div>
              <div className="min-w-0">
                <p className="text-[0.875rem] font-medium text-surface-900 truncate">
                  Acme Commerce
                </p>
                <p className="text-xs text-surface-600 truncate">Enterprise</p>
              </div>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              aria-label="Collapse sidebar"
              className="shrink-0 p-1.5 rounded-md hover:bg-surface-100 transition-colors"
            >
              <ChevronLeft size={16} className="text-surface-600" />
            </button>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/scenario-1"}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.875rem] font-medium transition-all duration-200",
                isActive
                  ? "bg-alhena-50 text-alhena-700 font-semibold"
                  : "text-surface-700 hover:text-surface-900 hover:bg-surface-50"
              )
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="py-4 px-3 border-t border-surface-100 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.875rem] font-medium transition-all duration-200 w-full",
                isActive
                  ? "bg-alhena-50 text-alhena-700 font-semibold"
                  : "text-surface-600 hover:text-surface-900 hover:bg-surface-50"
              )
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.875rem] font-medium text-surface-600 hover:text-alhena-700 hover:bg-alhena-50 transition-all duration-200 w-full"
        >
          <Home size={20} className="shrink-0" />
          {!collapsed && <span>Back to scenarios</span>}
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.875rem] font-medium text-surface-600 hover:text-danger-600 hover:bg-danger-50 transition-all duration-200 w-full">
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.875rem] font-medium text-surface-600 hover:text-alhena-700 hover:bg-alhena-50 transition-all duration-200 w-full"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} className="shrink-0" /> : <Moon size={20} className="shrink-0" />}
          {!collapsed && <span>{darkMode ? "Light mode" : "Dark mode"}</span>}
        </button>
      </div>

      {!collapsed && (
        <p className="px-4 pb-2 text-[10px] text-surface-400 text-center">
          Powered by Alhena
        </p>
      )}
    </aside>
  );
}
