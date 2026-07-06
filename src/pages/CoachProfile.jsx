import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

// MUI Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

function CoachProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        const res = await api.get(`/coach-service/${id}/fullprofile`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch full profile:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFullProfile();
  }, [id]);

  if (loading) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <p className="text-zinc-800 dark:text-zinc-200 text-sm font-medium">
            Profile not found
          </p>
          <p className="text-xs text-zinc-400 mt-1 mb-4">
            The requested profile record could not be extracted from the server.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-medium active:scale-95 transition-transform"
          >
            Return to Registry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-500">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 px-6 py-10 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
        {/* Navigation Return Link Line */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 group transition-colors cursor-pointer"
        >
          <ArrowBackIcon
            sx={{ fontSize: 16 }}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="text-xs font-medium">Back to Team</span>
        </button>

        {/* Profile Card Container Frame */}
        <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
          {/* Header Banner Background Node */}
          <div className="h-36 bg-zinc-100/70 dark:bg-zinc-900/40 border-b border-zinc-200/60 dark:border-zinc-800/60" />

          <div className="px-8 pb-10">
            {/* Context Header: Avatar Image Overlay + Title Header Rows */}
            <div className="relative -mt-14 flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-[#09090b] bg-zinc-50 dark:bg-zinc-900 shadow-sm shrink-0 flex items-center justify-center">
                {profile.url ? (
                  <img
                    src={profile.url}
                    className="w-full h-full object-cover"
                    alt={profile.name}
                  />
                ) : (
                  <PersonIcon sx={{ fontSize: 36, color: "#a1a1aa" }} />
                )}
              </div>
              <div className="pb-2 space-y-1 min-w-0">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight truncate">
                  {profile.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold tracking-tight text-zinc-400 uppercase">
                  <span className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                    ID // {profile.ras_id}
                  </span>
                  <span>•</span>
                  <span>{profile.gender || "Unspecified"}</span>
                </div>
              </div>
            </div>

            {/* Metric Configuration Breakdown Columns Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900">
              {/* Box Segment: Identity / Contact Attributes */}
              <div className="space-y-5">
                <h3 className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono">
                  // Core Records
                </h3>
                <div className="space-y-4">
                  <ProfileInfoItem
                    icon={<PhoneIcon sx={{ fontSize: 14 }} />}
                    label="Primary Connection"
                    value={profile.phone}
                    isMono
                  />
                  <ProfileInfoItem
                    icon={<BadgeIcon sx={{ fontSize: 14 }} />}
                    label="System Registry ID"
                    value={profile.ras_id}
                    isMono
                  />
                  <ProfileInfoItem
                    icon={<CakeIcon sx={{ fontSize: 14 }} />}
                    label="Date of Birth"
                    value={
                      profile.b_date
                        ? new Date(profile.b_date).toLocaleDateString()
                        : null
                    }
                  />
                </div>
              </div>

              {/* Box Segment: Specialties Directory Matrix */}
              <div className="space-y-5">
                <h3 className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <FitnessCenterIcon sx={{ fontSize: 12 }} /> // Area
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.trainingTypes?.length > 0 ? (
                    profile.trainingTypes.map((t) => (
                      <span
                        key={t.id}
                        className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-800 dark:text-zinc-200 text-xs font-medium shadow-sm"
                      >
                        {t.t_type}
                      </span>
                    ))
                  ) : (
                    <p className="text-zinc-400 text-xs italic tracking-tight">
                      No operational disciplines assigned.
                    </p>
                  )}
                </div>
              </div>

              {/* Box Segment: Operational Schedule Units */}
              <div className="space-y-5">
                <h3 className="text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CalendarMonthIcon sx={{ fontSize: 12 }} /> // Active Shifts
                </h3>
                <div className="space-y-2">
                  {profile.schedules?.length > 0 ? (
                    profile.schedules.map((s) => (
                      <div
                        key={s.id}
                        className="flex justify-between items-center px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 rounded-xl"
                      >
                        <span className="text-zinc-800 dark:text-zinc-200 text-xs font-medium uppercase font-mono tracking-tight">
                          {s.date}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 text-[10px] font-mono font-bold border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded">
                          {s.time}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-400 text-xs italic tracking-tight">
                      No operational calendar assigned.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── HELPER DATA ROW STRIP COMPONENTS ── */

function ProfileInfoItem({ icon, label, value, isMono = false }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-xl text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0 space-y-0.5">
        <p className="text-[10px] font-medium uppercase text-zinc-400 tracking-tight">
          {label}
        </p>
        <p
          className={`text-sm tracking-tight truncate ${value ? "text-zinc-900 dark:text-zinc-200 font-medium" : "text-zinc-400 italic font-normal"} ${isMono ? "font-mono text-xs" : ""}`}
        >
          {value || "Not assigned"}
        </p>
      </div>
    </div>
  );
}

/* ── LAYOUT SKELETON PLACEHOLDER STUBCARD ── */

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] animate-pulse p-12 flex justify-center items-center">
      <div className="w-full max-w-5xl h-150 bg-white dark:bg-zinc-900/20 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
    </div>
  );
}

export default CoachProfile;
