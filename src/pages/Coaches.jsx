import { useEffect, useState, useContext } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

// MUI Icons
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-500">
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
              <CoachCard key={coach.id} coach={coach} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/* ── COACH CARD COMPONENT ── */

function CoachCard({ coach }) {
  const navigate = useNavigate();

  const age = coach.b_date
    ? new Date().getFullYear() - new Date(coach.b_date).getFullYear()
    : null;

  return (
    <div className="group relative bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Context Menu Dropdown Anchor */}
      <div className="absolute top-4 right-4 z-10">
        <button className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 active:scale-95 transition-all cursor-pointer">
          <MoreVertIcon sx={{ fontSize: 16 }} />
        </button>
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
