import React from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 w-full p-5 flex items-center justify-between bg-[#0D1421] text-white">
      {/* Left: Logo */}
      <Link to={"/"} className="cursor-pointer text-blue-500 text-lg font-bold">
        Admin
      </Link>

      {/* Right: User Icon */}
      <div className="cursor-pointer">
        <AccountCircleIcon fontSize="large" />
      </div>
    </div>
  );
}

export default Navbar;
