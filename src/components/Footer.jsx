import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";

function Footer() {
  return (
    <footer className="w-fulls flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
      <div className="flex items-center gap-2">
        <EmailIcon sx={{ fontSize: 18 }} />
        <span>tesfayedawit22090582@gmail.com</span>
      </div>

      <div className="flex items-center gap-2">
        <PhoneIcon sx={{ fontSize: 18 }} />
        <span>+251 922 090 582</span>
      </div>

      <div className="flex items-center gap-2">
        <LanguageIcon sx={{ fontSize: 18 }} />
        <a
          href="https://dawit.et"
          className="hover:text-blue-500"
          target="_blank"
        >
          dawit.et
        </a>
      </div>
    </footer>
  );
}

export default Footer;
