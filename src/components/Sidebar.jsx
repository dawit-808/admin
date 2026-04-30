import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SpaceDashboard,
  People,
  Sports,
  EventNote,
  BarChart,
  Settings,
  Logout,
  AddBox,
  HealthAndSafety,
} from "@mui/icons-material";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 flex flex-col items-center py-6 bg-[#09090b] border-r border-white/10 z-[100]">
      {/* Brand Icon */}
      <div className="mb-10 flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-900/20">
          <Sports className="text-white" />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <NavItem
          path="/"
          icon={SpaceDashboard}
          label="Dashboard"
          isActive={location.pathname === "/"}
        />
        <NavItem
          path="/analytics"
          icon={BarChart}
          label="Insights"
          isActive={location.pathname === "/analytics"}
        />

        <div className="h-px w-8 bg-white/10 mx-auto my-2" />

        <NavItem
          path="/members"
          icon={People}
          label="Members"
          isActive={location.pathname === "/members"}
        />
        <NavItem
          path="/schedules"
          icon={EventNote}
          label="Schedule"
          isActive={location.pathname === "/schedules"}
        />

        {/* The Action Menu */}
        <QuickAction />
      </div>

      <div className="mt-auto flex flex-col gap-4 border-t border-white/5 pt-6">
        <NavItem
          path="/settings"
          icon={Settings}
          label="Settings"
          isActive={location.pathname === "/settings"}
        />
        <button className="p-3 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
          <Logout />
        </button>
      </div>
    </aside>
  );
};

// Refined NavItem
const NavItem = ({ path, icon: Icon, label, isActive }) => (
  <Link to={path} className="relative group flex items-center justify-center">
    <div
      className={`p-3 rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40"
          : "text-gray-500 hover:bg-white/5 hover:text-gray-200"
      }`}
    >
      <Icon />
    </div>
    <span className="absolute left-16 px-3 py-1.5 bg-gray-900 border border-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[110]">
      {label}
    </span>
  </Link>
);

// Fixed QuickAction Component
const QuickAction = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const links = [
    {
      label: "Add Member",
      path: "/add-member",
      icon: <People fontSize="small" />,
    },
    {
      label: "Add Coach",
      path: "/add-coach",
      icon: <Sports fontSize="small" />,
    },
    {
      label: "New Schedule",
      path: "/add-schedule",
      icon: <EventNote fontSize="small" />,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-xl transition-all ${isOpen ? "bg-emerald-500 text-white" : "bg-white/5 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/10"}`}
      >
        <AddBox />
      </button>

      {isOpen && (
        <div className="absolute left-full top-0 ml-4 w-52 bg-[#111113] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-left-2 duration-200">
          <div className="px-4 py-2 mb-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
              Quick Create
            </p>
          </div>
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)} // Close menu on click
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
            >
              <span className="opacity-70">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
