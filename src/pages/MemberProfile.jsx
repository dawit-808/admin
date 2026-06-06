// MemberProfile.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

// ICONS
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import HeightIcon from "@mui/icons-material/Height";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import EmergencyIcon from "@mui/icons-material/Emergency";

function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullProfile = async () => {
      try {
        const res = await api.get(`/member-service/${id}/fullprofile`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch member profile:", err);
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
            Member profile not found
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-500">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 px-6 py-10 max-w-6xl mx-auto space-y-6">
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          <span className="text-xs font-medium">Back to Members</span>
        </button>

        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          {/* TOP BANNER */}
          <div className="h-40 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800" />

          <div className="px-8 pb-10">
            {/* PROFILE TOP */}
            <div className="relative -mt-14 flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-[#09090b] bg-zinc-100 dark:bg-zinc-900 shadow-sm shrink-0 flex items-center justify-center">
                {profile.url ? (
                  <img
                    src={profile.url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PersonIcon sx={{ fontSize: 40, color: "#a1a1aa" }} />
                )}
              </div>

              <div className="pb-2">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                  {profile.name}
                </h1>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] uppercase font-mono font-bold tracking-wide text-zinc-400">
                  <span className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                    ID // {profile.ras_id}
                  </span>

                  <span>•</span>

                  <span>{profile.gender || "Unspecified"}</span>
                </div>
              </div>
            </div>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900">
              {/* PERSONAL */}
              <div className="space-y-5">
                <h3 className="section-title">// Personal Records</h3>

                <div className="space-y-4">
                  <ProfileInfoItem
                    icon={<PhoneIcon sx={{ fontSize: 14 }} />}
                    label="Phone Number"
                    value={profile.phone}
                    isMono
                  />

                  <ProfileInfoItem
                    icon={<BadgeIcon sx={{ fontSize: 14 }} />}
                    label="Member ID"
                    value={profile.ras_id}
                    isMono
                  />

                  <ProfileInfoItem
                    icon={<CakeIcon sx={{ fontSize: 14 }} />}
                    label="Date of Birth"
                    value={
                      profile.birthDate
                        ? new Date(profile.birthDate).toLocaleDateString()
                        : null
                    }
                  />
                </div>
              </div>

              {/* HEALTH */}
              <div className="space-y-5">
                <h3 className="section-title">// Health Metrics</h3>

                <div className="space-y-4">
                  <ProfileInfoItem
                    icon={<MonitorWeightIcon sx={{ fontSize: 14 }} />}
                    label="Weight"
                    value={profile.health?.weight}
                  />

                  <ProfileInfoItem
                    icon={<HeightIcon sx={{ fontSize: 14 }} />}
                    label="Height"
                    value={profile.health?.height}
                  />

                  <ProfileInfoItem
                    icon={<BloodtypeIcon sx={{ fontSize: 14 }} />}
                    label="Blood Type"
                    value={profile.health?.bloodType}
                  />
                </div>
              </div>

              {/* TRAINING */}
              <div className="space-y-5">
                <h3 className="section-title flex items-center gap-1.5">
                  <FitnessCenterIcon sx={{ fontSize: 12 }} />
                  // Training Types
                </h3>

                <div className="flex flex-wrap gap-2">
                  {profile.trainingTypes?.length > 0 ? (
                    profile.trainingTypes.map((t) => (
                      <span
                        key={t.id}
                        className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-800 dark:text-zinc-200 text-xs font-medium"
                      >
                        {t.t_type || t.name}
                      </span>
                    ))
                  ) : (
                    <p className="empty-text">No training assigned</p>
                  )}
                </div>
              </div>

              {/* EMERGENCY */}
              <div className="space-y-5">
                <h3 className="section-title flex items-center gap-1.5">
                  <EmergencyIcon sx={{ fontSize: 12 }} />
                  // Emergency Contact
                </h3>

                <div className="space-y-4">
                  <ProfileInfoItem
                    icon={<PersonIcon sx={{ fontSize: 14 }} />}
                    label="Full Name"
                    value={profile.emergency?.fullName}
                  />

                  <ProfileInfoItem
                    icon={<PhoneIcon sx={{ fontSize: 14 }} />}
                    label="Phone"
                    value={profile.emergency?.phone}
                    isMono
                  />

                  <ProfileInfoItem
                    icon={<BadgeIcon sx={{ fontSize: 14 }} />}
                    label="Relationship"
                    value={profile.emergency?.relationship}
                  />
                </div>
              </div>
            </div>

            {/* SCHEDULES */}
            <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900">
              <h3 className="section-title flex items-center gap-1.5 mb-5">
                <CalendarMonthIcon sx={{ fontSize: 12 }} />
                // Training Schedules
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.schedules?.length > 0 ? (
                  profile.schedules.map((s) => (
                    <div
                      key={s.id}
                      className="flex justify-between items-center px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
                    >
                      <span className="text-zinc-800 dark:text-zinc-200 text-xs font-medium uppercase font-mono">
                        {s.date || s.day}
                      </span>

                      <span className="text-[10px] font-mono font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-1 rounded">
                        {s.time || `${s.startTime} - ${s.endTime}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="empty-text">No schedules assigned</p>
                )}
              </div>
            </div>

            {/* COACHES */}
            <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900">
              <h3 className="section-title mb-5">// Assigned Coaches</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {profile.coaches?.length > 0 ? (
                  profile.coaches.map((coach) => (
                    <div
                      key={coach.id}
                      className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0">
                        <img
                          src={coach.url}
                          alt={coach.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                          {coach.name}
                        </h4>

                        <p className="text-xs text-zinc-500 mt-1">
                          {coach.phone}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-text">No coaches assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* HELPER */

function ProfileInfoItem({ icon, label, value, isMono = false }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5">
        {icon}
      </div>

      <div className="min-w-0 space-y-0.5">
        <p className="text-[10px] font-medium uppercase text-zinc-400 tracking-tight">
          {label}
        </p>

        <p
          className={`text-sm tracking-tight truncate ${
            value
              ? "text-zinc-900 dark:text-zinc-200 font-medium"
              : "text-zinc-400 italic"
          } ${isMono ? "font-mono text-xs" : ""}`}
        >
          {value || "Not assigned"}
        </p>
      </div>
    </div>
  );
}

/* SKELETON */

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] animate-pulse p-12 flex justify-center items-center">
      <div className="w-full max-w-6xl h-[500px] bg-white dark:bg-zinc-900/20 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
    </div>
  );
}

export default MemberProfile;
