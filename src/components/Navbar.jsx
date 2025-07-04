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

      {/* Right: User Icon */}
      <div className="cursor-pointer">
        <AccountCircleIcon fontSize="large" />
      </div>
    </div>
  );
}

export default Navbar;
