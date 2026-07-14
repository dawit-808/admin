// CoachProfile.jsx

import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";

import { ProfileSkeleton } from "../components/MemberProfile/ProfileSections";
import {
  CoachRecordsSection,
  CoachTrainingScopeSection,
  CoachSchedulesSection,
} from "../components/CoachSections";

function CoachProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFullProfile = useCallback(async () => {
    try {
      const res = await api.get(`/coach-service/${id}/fullprofile`);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch full profile:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchFullProfile();
  }, [id, fetchFullProfile]);

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

        <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="h-36 bg-zinc-100/70 dark:bg-zinc-900/40 border-b border-zinc-200/60 dark:border-zinc-800/60" />

          <div className="px-8 pb-10">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900">
              <CoachRecordsSection
                profile={profile}
                coachId={id}
                onUpdated={fetchFullProfile}
              />
              <CoachTrainingScopeSection
                profile={profile}
                coachId={id}
                onUpdated={fetchFullProfile}
              />
              <CoachSchedulesSection
                profile={profile}
                coachId={id}
                onUpdated={fetchFullProfile}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CoachProfile;
