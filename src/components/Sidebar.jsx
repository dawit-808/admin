import React from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import Dropdown from "./Dropdown";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="fixed top-16 left-0 w-16 h-[calc(100vh-64px)] bg-[#0D1421] text-white p-4 flex flex-col justify-between items-center">
      {/* Top icons */}
      <div className="flex flex-col gap-6">
        {/* Add Member or coach*/}
        <div className="flex flex-col gap-6">
          <Dropdown />
        </div>

        {/* Reports */}
        <Link to={"/report"} className="relative group">
          <BarChartIcon
            sx={{ fontSize: 22 }}
            className="cursor-pointer hover:text-blue-500"
          />
          <span className="absolute z-10 left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Reports
          </span>
        </Link>
      </div>

      {/* Logout */}
      <div className="relative group">
        <LogoutIcon
          sx={{ fontSize: 22 }}
          className="cursor-pointer hover:text-blue-500"
        />
        <span className="absolute z-10 left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-red-500 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Logout
        </span>
      </div>
    </div>
  );
}

export default Sidebar;
