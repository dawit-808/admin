import { Link } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState, useRef, useEffect } from "react";

function Dropdown() {
  const [showMenu, setShowMenu] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <PersonAddIcon
        sx={{ fontSize: 22 }}
        onClick={() => setShowMenu((prev) => !prev)}
        className="cursor-pointer hover:text-blue-500"
      />

      {showMenu && (
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[#0D1421] text-white rounded shadow-lg w-36 z-10 flex flex-col text-sm">
          <Link
            to="/add-member"
            onClick={() => setShowMenu(false)}
            className="hover:text-blue-500 px-4 py-2 text-left"
          >
            Add Member
          </Link>
          <Link
            to="/add-coach"
            onClick={() => setShowMenu(false)}
            className="hover:text-blue-500 px-4 py-2 text-left"
          >
            Add Coach
          </Link>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
