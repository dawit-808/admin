import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 w-full p-5 flex items-center justify-between bg-[#0D1421] text-white">
      {/* Left: Logo */}
      <div className="cursor-pointer text-blue-500 text-lg font-bold">
        Admin
      </div>

      {/* Center: Search Input with Icon */}
      <div className="w-1/2">
        <div className="flex items-center bg-gray-800 border border-gray-500 rounded-full px-4 focus-within:ring-2 focus-within:ring-blue-500">
          <SearchIcon className="text-blue-500" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-3 py-2 text-gray-200 bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Right: User Icon */}
      <div className="cursor-pointer">
        <AccountCircleIcon fontSize="large" />
      </div>
    </div>
  );
}

export default Navbar;
