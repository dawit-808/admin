import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  People,
  Sports,
  EventNote,
  HowToReg,
  AddCircleOutline,
  Logout,
} from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-5 bg-[#09090b] border-r border-zinc-800/60 z-[100] select-none">
      {/* Brand Icon - Linked to Home "/" */}
      <Link
        to="/"
        className="mb-8 p-2 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:border-zinc-700/80 transition-all duration-300 group shadow-sm"
      >
        <Sports className="text-zinc-400 group-hover:text-zinc-100 !text-[18px] transition-colors" />
      </Link>

      {/* Main Nav Stack */}
      <div className="flex flex-col gap-3.5 items-center w-full px-2">
        <NavItem
          path="/members"
          icon={People}
          label="Members"
          isActive={location.pathname === "/members"}
        />
        <NavItem
          path="/coaches"
          icon={HowToReg}
          label="Staff"
          isActive={location.pathname === "/coaches"}
        />
        <NavItem
          path="/schedule-trainings"
          icon={EventNote}
          label="Schedule + Trainings"
          isActive={location.pathname === "/schedule-trainings"}
        />

        <ActionItem
          icon={AddCircleOutline}
          label="Quick Add"
          header="Actions"
          items={[
            {
              label: "Add Member",
              path: "/add-member",
              icon: <People className="!text-[15px]" />,
            },
            {
              label: "Add Coach",
              path: "/add-coach",
              icon: <EventNote className="!text-[15px]" />,
            },
          ]}
        />
        <NavItem
          path="/verify-payment"
          icon={PaymentIcon}
          label="Verify Payment"
          isActive={location.pathname === "/verify-payment"}
        />
      </div>

      {/* Logout - Bottom Pinned */}
      <div className="mt-auto w-full px-3 pt-4 border-t border-zinc-800/60 flex justify-center">
        <button
          onClick={handleLogout}
          className="group relative w-10 h-10 flex items-center justify-center rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200 cursor-pointer"
        >
          <Logout className="!text-[18px]" />
          <Tooltip label="Logout" />
        </button>
      </div>
    </aside>
  );
};

// Premium Nav Link Component
const NavItem = ({ path, icon: Icon, label, isActive, badge }) => (
  <Link
    to={path}
    className="relative group w-10 h-10 flex items-center justify-center"
  >
    {/* Active Ambient Indicator Bar */}
    {isActive && (
      <div className="absolute left-0 w-[3px] h-5 bg-zinc-200 rounded-r-full" />
    )}

    <div
      className={`w-full h-full flex items-center justify-center rounded-xl transition-all duration-200 relative ${
        isActive
          ? "bg-zinc-800/80 text-zinc-100 border border-zinc-700/50"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
      }`}
    >
      <Icon className="!text-[18px]" />

      {/* Dynamic Counter/Badge */}
      {badge && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-zinc-100 text-[#09090b] font-semibold text-[9px] rounded-full ring-2 ring-[#09090b]">
          {badge}
        </span>
      )}
    </div>
    <Tooltip label={label} />
  </Link>
);

// High-end Dropdown Menu Action Button
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
    <div className="relative w-10 h-10 flex justify-center" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-full flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
          isOpen
            ? "bg-zinc-800 text-zinc-100 border border-zinc-700/50"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
        }`}
      >
        <Icon className="!text-[18px]" />
      </button>

      {!isOpen && <Tooltip label={label} />}

      {isOpen && (
        <div className="absolute left-full top-0 ml-3 w-48 bg-[#0c0c0e] border border-zinc-800/80 rounded-xl shadow-xl py-1.5 animate-in fade-in slide-in-from-left-1 duration-150 z-[120]">
          <div className="px-3 py-1 mb-1">
            <p className="text-[9px] font-medium text-zinc-500 uppercase tracking-wider">
              {header}
            </p>
          </div>
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-1.5 text-[12px] text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 transition-colors"
            >
              <span className="text-zinc-500 flex items-center">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Tooltip refinement
const Tooltip = ({ label }) => (
  <span className="absolute left-14 px-2 py-1 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px] font-medium rounded-md opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap z-[110] shadow-md">
    {label}
  </span>
);

export default Sidebar;
