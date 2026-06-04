import { useEffect, useState } from "react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="z-100 fixed bottom-6 right-6 p-4 rounded-2xl shadow-2xl transition-all 
                 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-amber-400
                 border border-zinc-200 dark:border-zinc-700 z-50 hover:scale-110"
    >
      {theme === "dark" ? <WbSunnyIcon /> : <DarkModeIcon />}
    </button>
  );
}
