import { useEffect, useState, useContext, useRef } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import toast, { Toaster } from "react-hot-toast";

// MUI Icons
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function Coaches() {
  const { accessToken } = useContext(AuthContext);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoaches = async () => {
    try {
      const res = await api.get("/coaches");
      setCoaches(res.data);
    } catch (err) {
      console.error("Failed to fetch coaches:", err);
      toast.error("Failed to load coaches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [accessToken]);

  const handleDeleteCoach = async (id, name) => {
    // Optimistically remove from UI, roll back on failure
    const prevCoaches = coaches;
    setCoaches((cur) => cur.filter((c) => c.id !== id));

    const toastId = toast.loading(`Deleting ${name || "coach"}...`);
    try {
      await api.delete(`/coach-service/${id}/fulldelete`);
      toast.success(`${name || "Coach"} deleted`, { id: toastId });
    } catch (err) {
      console.error("Failed to delete coach:", err);
      setCoaches(prevCoaches);
      toast.error(`Failed to delete ${name || "coach"}`, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-500">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 px-6 md:px-12 py-10 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* ── HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              Coaches Team
            </h1>
            <p className="text-xs text-zinc-400">
              Manage directory and contact information for all staff members.
            </p>
          </div>
          <div className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm w-fit">
            STAFF_COUNT // {coaches.length.toString().padStart(2, "0")}
          </div>
        </header>

        {/* ── CONTENT CONTAINER ── */}
        {loading ? (
          /* Multi-card Skeleton Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-[340px] bg-white dark:bg-zinc-900/20 animate-pulse rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60"
              />
            ))}
          </div>
        ) : coaches.length === 0 ? (
          /* Empty fallback element layout */
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/40 dark:bg-transparent max-w-md mx-auto mt-12 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mb-4">
              <PersonIcon sx={{ fontSize: 22 }} />
            </div>
            <p className="text-zinc-800 dark:text-zinc-200 text-sm font-medium">
              No coaches found
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              There are currently no staff records registered in the core
              database directory.
            </p>
          </div>
        ) : (
          /* Main Card Grid Display */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coaches.map((coach) => (
              <CoachCard
                key={coach.id}
                coach={coach}
                onDelete={handleDeleteCoach}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ── COACH CARD COMPONENT ── */

function CoachCard({ coach, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const age = coach.b_date
    ? new Date().getFullYear() - new Date(coach.b_date).getFullYear()
    : null;

  const handleDeleteClick = () => {
    setMenuOpen(false);

    toast(
      (t) => (
        <div className="w-[330px]">
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
            <DeleteOutlineIcon
              sx={{
                fontSize: 30,
                color: "#ef4444",
              }}
            />
          </div>

          {/* Title */}
          <h3 className="mt-4 text-center text-base font-semibold text-zinc-900 dark:text-white">
            Delete Coach?
          </h3>

          {/* Description */}
          <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            You're about to permanently remove
          </p>

          <p className="mt-1 text-center font-semibold text-red-500">
            {coach.name || "this coach"}
          </p>

          {/* Warning Box */}
          <div className="mt-5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-500/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-500 mb-2">
              This will remove:
            </p>

            <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
              <li>• Coach profile</li>
              <li>• Assigned members</li>
              <li>• Training records</li>
              <li>• Related database references</li>
            </ul>
          </div>

          <p className="mt-4 text-center text-xs font-medium text-red-500">
            This action cannot be undone.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                toast.dismiss(t.id);
                onDelete(coach.id, coach.name);
              }}
              className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
            >
              Delete Coach
            </button>
          </div>
        </div>
      ),
      {
        duration: 500,
        style: {
          borderRadius: "18px",
          padding: "22px",
          background: "var(--toast-bg, #fff)",
          maxWidth: "380px",
        },
      },
    );
  };

  return (
    <div className="group relative bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Context Menu Dropdown Anchor */}
      <div className="absolute top-4 right-4 z-10" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 active:scale-95 transition-all cursor-pointer"
        >
          <MoreVertIcon sx={{ fontSize: 16 }} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-1.5 w-40 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={handleDeleteClick}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <DeleteOutlineIcon sx={{ fontSize: 15 }} />
              Delete Coach
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4">
          {/* Avatar Image Frame wrapper */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shadow-inner">
              {coach.url ? (
                <img
                  src={coach.url}
                  alt={coach.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <span className="text-sm font-medium text-zinc-400 uppercase">
                  {coach.name ? coach.name.charAt(0) : "?"}
                </span>
              )}
            </div>
            {/* System Status Node Indicator */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#09090b] rounded-full shadow-sm" />
          </div>

          {/* Core Text Elements Block */}
          <div className="space-y-0.5 min-w-0">
            <h2 className="text-zinc-900 dark:text-zinc-100 font-semibold text-base leading-tight truncate pr-6">
              {coach.name}
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-zinc-400 uppercase tracking-tight">
              <span>{coach.gender || "Unspecified"}</span>
              {age && (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700">•</span>
                  <span>{age} YRS_OLD</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Attribute Metric List rows */}
        <div className="mt-6 space-y-1.5">
          <DetailRow
            icon={<PhoneIcon sx={{ fontSize: 13 }} />}
            label="Contact"
            value={coach.phone}
            isMono
          />
          <DetailRow
            icon={<BadgeIcon sx={{ fontSize: 13 }} />}
            label="Registry ID"
            value={coach.ras_id}
            isMono
          />
          <DetailRow
            icon={<CakeIcon sx={{ fontSize: 13 }} />}
            label="Birth Date"
            value={
              coach.b_date ? new Date(coach.b_date).toLocaleDateString() : null
            }
          />
        </div>

        {/* Action Trigger Button Surface */}
        <button
          onClick={() => navigate(`/coaches/${coach.id}`)}
          className="mt-5 w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black rounded-full text-xs font-medium transition-all active:scale-95 shadow-sm cursor-pointer"
        >
          View Full Profile
        </button>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value, isMono = false }) {
  return (
    <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/40">
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 dark:text-zinc-500 flex items-center">
          {icon}
        </span>
        <span className="text-[10px] font-medium text-zinc-400 tracking-tight">
          {label}
        </span>
      </div>
      <span
        className={`text-xs ${value ? "text-zinc-800 dark:text-zinc-200 font-medium" : "text-zinc-400 italic font-normal"} ${isMono ? "font-mono" : ""}`}
      >
        {value || "Not configured"}
      </span>
    </div>
  );
}

export default Coaches;
