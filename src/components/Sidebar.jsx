import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SpaceDashboard,
  People,
  Sports,
  EventNote,
  BarChart,
  Logout,
  HowToReg,
  AddCircleOutline,
  PersonAdd,
} from "@mui/icons-material";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-6 bg-[#09090b] border-r border-zinc-800/50 z-[100]">
      {/* Brand Icon - Minimalist */}
      <div className="mb-8">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
          <Sports className="text-white !text-[18px]" />
        </div>
      </div>

      {/* Main Nav Stack - All items share equal vertical spacing */}
      <div className="flex flex-col gap-4 items-center w-full">
        <NavItem
          path="/"
          icon={SpaceDashboard}
          label="Dashboard"
          isActive={location.pathname === "/"}
        />
        <NavItem
          path="/statistics"
          icon={BarChart}
          label="Stats"
          isActive={location.pathname === "/statistics"}
        />

        <NavItem
          path="/coaches"
          icon={People}
          label="Staff"
          isActive={location.pathname === "/coaches"}
        />
        <NavItem
          path="/schedules"
          icon={EventNote}
          label="Schedule"
          isActive={location.pathname === "/schedules"}
        />

        {/* Action Items - Integrated into the same flow */}
        <ActionItem
          icon={HowToReg}
          label="Register"
          header="Registration"
          items={[
            {
              label: "New Member",
              path: "/register/member",
              icon: <PersonAdd className="!text-[16px]" />,
            },
            {
              label: "New Coach",
              path: "/register/coach",
              icon: <Sports className="!text-[16px]" />,
            },
          ]}
        />

        <ActionItem
          icon={AddCircleOutline}
          label="Quick Add"
          header="Actions"
          items={[
            {
              label: "Add Member",
              path: "/add-member",
              icon: <People className="!text-[16px]" />,
            },
            {
              label: "Add Schedule",
              path: "/add-schedule",
              icon: <EventNote className="!text-[16px]" />,
            },
          ]}
        />
      </div>

      {/* Logout - Pinned to bottom */}
      <div className="mt-auto pt-6 border-t border-zinc-800/50 w-full flex justify-center">
        <button className="group relative p-2 text-zinc-500 hover:text-rose-400 transition-colors">
          <Logout className="!text-[20px]" />
          <Tooltip label="Logout" />
        </button>
      </div>
    </aside>
  );
};

// Standard Nav Link
const NavItem = ({ path, icon: Icon, label, isActive }) => (
  <Link to={path} className="relative group flex items-center justify-center">
    <div
      className={`p-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-zinc-800 text-white"
          : "text-zinc-500 hover:text-zinc-200"
      }`}
    >
      <Icon className="!text-[20px]" />
    </div>
    <Tooltip label={label} />
  </Link>
);

// Integrated Action Item (Dropdown)
const ActionItem = ({ icon: Icon, label, header, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const clickOut = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  return (
    <div className="relative flex justify-center group" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isOpen
            ? "bg-zinc-800 text-blue-400"
            : "text-zinc-500 hover:text-zinc-200"
        }`}
      >
        <Icon className="!text-[20px]" />
      </button>

      {!isOpen && <Tooltip label={label} />}

      {isOpen && (
        <div className="absolute left-full top-0 ml-3 w-44 bg-[#0c0c0e] border border-zinc-800 rounded-lg shadow-2xl py-1.5 animate-in fade-in slide-in-from-left-1 duration-150 z-[120]">
          <div className="px-3 py-1.5 mb-1 border-b border-zinc-800/50">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              {header}
            </p>
          </div>
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <span className="text-zinc-500">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Tooltip = ({ label }) => (
  <span className="absolute left-12 px-2 py-1 bg-zinc-900 border border-zinc-800 text-zinc-200 text-[11px] font-medium rounded opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[110]">
    {label}
  </span>
);

export default Sidebar;
