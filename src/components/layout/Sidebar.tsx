import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  AlertTriangle,
  Settings,
  BarChart3,
  HelpCircle,
  LogOut,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/drilldown", icon: BarChart3, label: "Performance" },
  { to: "/anomaly", icon: AlertTriangle, label: "Alerts" },
  { to: "/onboarding", icon: Zap, label: "Setup" },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-screen bg-surface-900 text-white flex flex-col z-50 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-alhena-400 to-alhena-600 flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-[15px] tracking-tight">
            Alhena
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "ml-auto p-1.5 rounded-md hover:bg-white/10 transition-colors",
            collapsed && "ml-0"
          )}
        >
          <ChevronLeft
            size={16}
            className={clsx(
              "transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-alhena-600/30 text-alhena-300"
                  : "text-surface-400 hover:text-white hover:bg-white/5"
              )
            }
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="py-4 px-3 border-t border-white/10 space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-400 hover:text-white hover:bg-white/5 transition-all duration-200 w-full"
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-400 hover:text-danger-500 hover:bg-danger-500/10 transition-all duration-200 w-full">
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>

      {!collapsed && (
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-alhena-500/30 flex items-center justify-center text-xs font-semibold text-alhena-300">
              AC
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Acme Commerce
              </p>
              <p className="text-xs text-surface-400 truncate">Enterprise</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
