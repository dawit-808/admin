import React from "react";
import { Link } from "react-router-dom";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] h-16 border-b border-gray-800/50 bg-[#030712]/80 backdrop-blur-md px-6 flex items-center justify-between">
      {/* Left: Brand */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white group-hover:rotate-12 transition-transform">
          A
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Admin<span className="text-blue-500">Panel</span>
        </span>
      </Link>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all">
          <NotificationsNoneIcon fontSize="small" />
        </button>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all">
          <DarkModeOutlinedIcon fontSize="small" />
        </button>
        <div className="h-8 w-[1px] bg-gray-800 mx-2" />
        <div className="flex items-center gap-3 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-white">Alex Rivera</p>
            <p className="text-[10px] text-gray-500">Super Admin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 border-2 border-gray-800 group-hover:border-blue-500 transition-all" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
