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
  if (!profile)
    return (
      <div className="text-center py-20 text-zinc-500 font-medium">
        Profile not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-500">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 px-6 py-10 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8 group transition-colors"
        >
          <ArrowBackIcon
            fontSize="small"
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-medium">Back to Team</span>
        </button>

        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/[0.05] rounded-[2.5rem] overflow-hidden shadow-sm dark:shadow-2xl transition-colors">
          {/* Header Banner - Adaptive Gradients */}
          <div className="h-44 bg-gradient-to-br from-indigo-500/10 via-zinc-100 to-white dark:from-indigo-500/20 dark:via-zinc-900 dark:to-zinc-900 border-b border-zinc-100 dark:border-white/[0.05]" />

          <div className="px-10 pb-12">
            {/* Top Section: Avatar & Basic Info */}
            <div className="relative -mt-20 flex flex-col md:flex-row md:items-end gap-8">
              <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-[8px] border-white dark:border-[#030303] bg-zinc-100 dark:bg-zinc-800 shadow-xl transition-transform hover:scale-[1.02]">
                {profile.url ? (
                  <img
                    src={profile.url}
                    className="w-full h-full object-cover"
                    alt={profile.name}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                    <PersonIcon sx={{ fontSize: 50, color: "#94a3b8" }} />
                  </div>
                )}
              </div>
              <div className="pb-4 space-y-2">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  {profile.name}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                    Registry ID: {profile.ras_id}
                  </span>
                  <span className="text-zinc-400 dark:text-zinc-500 text-sm font-medium italic">
                    • {profile.gender}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
              {/* Column 1: Contact & Personal */}
              <div className="space-y-10">
                <section>
                  <h3 className="text-zinc-400 dark:text-white text-xs font-bold uppercase tracking-[0.2em] opacity-80 dark:opacity-40 mb-6">
                    Personal Details
                  </h3>
                  <div className="space-y-6">
                    <ProfileInfoItem
                      icon={<PhoneIcon />}
                      label="Phone"
                      value={profile.phone}
                    />
                    <ProfileInfoItem
                      icon={<BadgeIcon />}
                      label="Official ID"
                      value={profile.ras_id}
                    />
                    <ProfileInfoItem
                      icon={<CakeIcon />}
                      label="Birth Date"
                      value={profile.b_date || "Not Provided"}
                    />
                  </div>
                </section>
              </div>

              {/* Column 2: Training Types */}
              <div className="space-y-10">
                <section>
                  <h3 className="text-zinc-400 dark:text-white text-xs font-bold uppercase tracking-[0.2em] opacity-80 dark:opacity-40 mb-6 flex items-center gap-2">
                    <FitnessCenterIcon sx={{ fontSize: 14 }} /> Specialty
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.trainingTypes?.length > 0 ? (
                      profile.trainingTypes.map((t) => (
                        <span
                          key={t.id}
                          className="px-4 py-2 bg-zinc-50 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.05] rounded-xl text-zinc-700 dark:text-zinc-200 text-xs font-bold shadow-sm dark:shadow-none"
                        >
                          {t.t_type}
                        </span>
                      ))
                    ) : (
                      <p className="text-zinc-400 text-xs italic">
                        No types assigned
                      </p>
                    )}
                  </div>
                </section>
              </div>

              {/* Column 3: Work Schedule */}
              <div className="space-y-10">
                <section>
                  <h3 className="text-zinc-400 dark:text-white text-xs font-bold uppercase tracking-[0.2em] opacity-80 dark:opacity-40 mb-6 flex items-center gap-2">
                    <CalendarMonthIcon sx={{ fontSize: 14 }} /> Shift Schedule
                  </h3>
                  <div className="space-y-3">
                    {profile.schedules?.length > 0 ? (
                      profile.schedules.map((s) => (
                        <div
                          key={s.id}
                          className="flex justify-between items-center p-4 bg-white dark:bg-indigo-500/5 border border-zinc-100 dark:border-indigo-500/10 rounded-2xl shadow-sm dark:shadow-none"
                        >
                          <span className="text-zinc-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-widest">
                            {s.date}
                          </span>
                          <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-transparent">
                            {s.time}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-400 text-xs italic">
                        No schedule assigned
                      </p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileInfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-5 group">
      <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl text-zinc-400 dark:text-zinc-500 border border-zinc-100 dark:border-white/[0.02] group-hover:text-indigo-500 transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 tracking-widest">
          {label}
        </p>
        <p className="text-zinc-900 dark:text-zinc-200 font-bold tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] animate-pulse p-20 flex justify-center">
      <div className="w-full max-w-5xl h-[600px] bg-white dark:bg-zinc-900/40 rounded-[3rem] border border-zinc-200 dark:border-white/[0.05]" />
    </div>
  );
}

export default CoachProfile;
