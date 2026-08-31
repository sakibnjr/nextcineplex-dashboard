import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  Building2,
  CalendarDays,
  Ticket,
  Popcorn,
  Clapperboard,
} from "lucide-react";

const navItems = [
  { label: "Overview", path: "/dashboard/overview", icon: LayoutDashboard },
  { label: "Movies Catalog", path: "/dashboard/movies", icon: Film },
  { label: "Cinemas & Halls", path: "/dashboard/cinemas", icon: Building2 },
  { label: "Showtimes", path: "/dashboard/showtimes", icon: CalendarDays },
  { label: "Bookings & POS", path: "/dashboard/bookings", icon: Ticket },
  { label: "Snacks & Orders", path: "/dashboard/snacks", icon: Popcorn },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-950/95 border-r border-slate-800/80 flex flex-col h-screen shrink-0 select-none">
      {/* Brand Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shadow-md shadow-red-600/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Clapperboard className="w-4 h-4 text-red-500" />
          </div>
        </div>
        <div>
          <span className="font-bold text-base tracking-tight text-white block leading-tight">
            NextCineplex
          </span>
          <span className="text-[10px] text-red-400/80 font-medium tracking-wider uppercase">
            Admin Portal
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/25 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/80"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All systems operational</span>
        </div>
        <div className="text-[10px] text-slate-600 mt-1">
          v1.0.0 • Bangladesh
        </div>
      </div>
    </aside>
  );
};
