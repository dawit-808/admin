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

      <main className="ml-20 px-6 md:px-12 py-10 max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
              Coaches Team
            </h1>
            <p className="text-sm text-zinc-500">
              Manage directory and contact information for all staff members.
            </p>
          </div>
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-100 dark:border-indigo-500/20 w-fit">
            Total Staff: {coaches.length}
          </div>
        </header>

        {/* CONTENT */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 bg-white dark:bg-zinc-900/40 animate-pulse rounded-2xl border border-zinc-200 dark:border-white/[0.05]"
              />
            ))}
          </div>
        ) : coaches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white/50 dark:bg-transparent">
            <PersonIcon
              className="text-zinc-300 dark:text-zinc-700 mb-2"
              sx={{ fontSize: 48 }}
            />
            <p className="text-zinc-500 text-sm font-medium">
              No coaches found in the registry
            </p>
          </div>
        ) : (
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

/* ---------- Coach Card Component ---------- */

function CoachCard({ coach }) {
  const navigate = useNavigate();

  const age = coach.b_date
    ? new Date().getFullYear() - new Date(coach.b_date).getFullYear()
    : null;

  return (
    <div className="group relative bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/[0.05] rounded-2xl overflow-hidden hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all duration-300 shadow-sm dark:shadow-none hover:shadow-md dark:hover:border-white/10">
      {/* Top Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Card Header with Options */}
      <div className="absolute top-4 right-4 z-10">
        <button className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <MoreVertIcon fontSize="small" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-start gap-5">
          {/* Avatar Area */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-zinc-100 dark:border-white/[0.05] bg-zinc-100 dark:bg-zinc-800 group-hover:border-indigo-500/30 transition-colors">
              {coach.url ? (
                <img
                  src={coach.url}
                  alt={coach.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-400 dark:text-zinc-600 bg-zinc-50 dark:bg-zinc-900">
                  <PersonIcon sx={{ fontSize: 32 }} />
                </div>
              )}
            </div>
            {/* Status Dot */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#030303] rounded-full shadow-sm" />
          </div>

          {/* Identity */}
          <div className="space-y-1 pt-1">
            <h2 className="text-zinc-900 dark:text-white font-bold text-lg leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {coach.name}
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              <span>{coach.gender}</span>
              {age && (
                <>
                  <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                  <span>{age} yrs</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="mt-8 grid grid-cols-1 gap-2.5">
          <DetailRow
            icon={<PhoneIcon sx={{ fontSize: 14 }} />}
            label="Contact"
            value={coach.phone}
          />
          <DetailRow
            icon={<BadgeIcon sx={{ fontSize: 14 }} />}
            label="Registry ID"
            value={coach.ras_id}
          />
          <DetailRow
            icon={<CakeIcon sx={{ fontSize: 14 }} />}
            label="Birth Date"
            value={coach.b_date || "Not Provided"}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate(`/coaches/${coach.id}`)}
          className="mt-6 w-full py-3 bg-zinc-50 dark:bg-white/[0.03] hover:bg-indigo-600 hover:text-white border border-zinc-200 dark:border-white/[0.05] rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-300 transition-all shadow-sm hover:shadow-indigo-500/20 active:scale-[0.98]"
        >
          View Full Profile
        </button>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50/50 dark:bg-black/20 border border-zinc-100 dark:border-white/[0.02] transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 dark:text-zinc-500">{icon}</span>
        <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-xs text-zinc-700 dark:text-zinc-300 font-bold">
        {value}
      </span>
    </div>
  );
}

export default Coaches;
