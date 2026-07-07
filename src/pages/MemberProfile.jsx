// MemberProfile.jsx

import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  ProfileHeader,
  ProfileSkeleton,
  PersonalRecordsSection,
  HealthMetricsSection,
  EmergencyContactSection,
  TrainingScopeSection,
  SchedulesSection,
  CoachesSection,
} from "../components/MemberProfile/ProfileSections";

function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFullProfile = useCallback(async () => {
    try {
      const res = await api.get(`/member-service/${id}/fullprofile`);
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch member profile:", err);
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
            Member profile not found
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-medium transition-transform active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isActive = profile.payment_status === 1;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-300">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 px-4 md:px-8 py-10 max-w-6xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
        >
          <ArrowBackIcon
            sx={{ fontSize: 16 }}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span className="text-xs font-medium">Back to Members</span>
        </button>

        <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-10">
            <ProfileHeader profile={profile} isActive={isActive} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              <PersonalRecordsSection
                profile={profile}
                memberId={id}
                onUpdated={fetchFullProfile}
              />
              <HealthMetricsSection
                profile={profile}
                memberId={id}
                onUpdated={fetchFullProfile}
              />
              <TrainingScopeSection
                profile={profile}
                memberId={id}
                onUpdated={fetchFullProfile}
              />
              <EmergencyContactSection
                profile={profile}
                memberId={id}
                onUpdated={fetchFullProfile}
              />
            </div>

            <SchedulesSection
              profile={profile}
              memberId={id}
              onUpdated={fetchFullProfile}
            />
            <CoachesSection
              profile={profile}
              memberId={id}
              onUpdated={fetchFullProfile}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default MemberProfile;
