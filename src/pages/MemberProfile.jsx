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
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import HeightIcon from "@mui/icons-material/Height";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import HomeIcon from "@mui/icons-material/Home";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import HealingIcon from "@mui/icons-material/Healing";
import QRCode from "react-qr-code";

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
            className="mt-4 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full text-xs font-medium transition-transform active:scale-95"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check payment status (1 = active, anything else = inactive)
  const isActive = profile.payment_status === 1;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-300">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 px-4 md:px-8 py-10 max-w-6xl mx-auto space-y-6">
        {/* BACK BUTTON */}
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

        {/* MAIN PROFILE CARD */}
        <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-10">
            {/* HEADER ALIGNMENT FIX */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-zinc-100 dark:border-zinc-900 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Profile Image */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-inner shrink-0 flex items-center justify-center">
                  {profile.url || profile.img_url ? (
                    <img
                      src={profile.url || profile.img_url}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PersonIcon sx={{ fontSize: 36, color: "#a1a1aa" }} />
                  )}
                </div>

                {/* Name & Quick Metadata */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                      {profile.name}
                    </h1>
                    {/* Payment Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-medium rounded-full ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60"
                          : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`}
                      />
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase font-mono font-bold tracking-wide text-zinc-400">
                    <span className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                      ID : {profile.ras_id || "N/A"}
                    </span>
                    <span>•</span>
                    <span className="bg-zinc-50 dark:bg-zinc-900 px-2 py-0.5 rounded text-zinc-500">
                      {profile.gender || "Unspecified"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Refined Pro QR Code Container */}
              <div className="self-start md:self-auto bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-3 border border-zinc-100 dark:border-zinc-850 flex items-center gap-4 max-w-xs shadow-sm">
                <div className="p-1.5 bg-white rounded-lg inline-block shrink-0">
                  <QRCode
                    value={`${window.location.origin}/members/${profile.id}`}
                    size={64}
                    bgColor="#ffffff"
                    fgColor="#09090b"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                    Member QR Pass
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-tight">
                    Scan for check-in or access validation
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT SECTIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
              {/* PERSONAL RECORDS */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                  Personal Records
                </h3>
                <div className="space-y-3.5">
                  <ProfileInfoItem
                    icon={<PhoneIcon sx={{ fontSize: 13 }} />}
                    label="Phone Number"
                    value={profile.phone}
                    isMono
                  />
                  <ProfileInfoItem
                    icon={<BadgeIcon sx={{ fontSize: 13 }} />}
                    label="Member ID"
                    value={profile.ras_id}
                    isMono
                  />
                  <ProfileInfoItem
                    icon={<CakeIcon sx={{ fontSize: 13 }} />}
                    label="Date of Birth"
                    value={
                      profile.b_date
                        ? new Date(profile.b_date).toLocaleDateString()
                        : null
                    }
                  />
                  <ProfileInfoItem
                    icon={<HomeIcon sx={{ fontSize: 13 }} />}
                    label="Address"
                    value={
                      profile.sub_city || profile.woreda
                        ? `${profile.sub_city || "-"}, Woreda ${profile.woreda || "-"}`
                        : null
                    }
                  />
                </div>
              </div>

              {/* HEALTH & MEDICAL METRICS */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                  Health Metrics
                </h3>
                <div className="space-y-3.5">
                  <ProfileInfoItem
                    icon={<MonitorWeightIcon sx={{ fontSize: 13 }} />}
                    label="Weight"
                    value={
                      profile.health?.weight
                        ? `${profile.health.weight} kg`
                        : null
                    }
                  />
                  <ProfileInfoItem
                    icon={<HeightIcon sx={{ fontSize: 13 }} />}
                    label="Height"
                    value={
                      profile.health?.height
                        ? `${profile.health.height} cm`
                        : null
                    }
                  />
                  <ProfileInfoItem
                    icon={<BloodtypeIcon sx={{ fontSize: 13 }} />}
                    label="Blood Type"
                    value={profile.health?.bloodType}
                  />
                  <ProfileInfoItem
                    icon={<HealingIcon sx={{ fontSize: 13 }} />}
                    label="Reported Injury"
                    value={profile.health?.injury}
                  />
                  <ProfileInfoItem
                    icon={<MedicalServicesIcon sx={{ fontSize: 13 }} />}
                    label="Medical Issue"
                    value={profile.health?.issue}
                  />
                </div>
              </div>

              {/* TRAINING TYPES */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                  Training Scope
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.trainingTypes?.length > 0 ? (
                    profile.trainingTypes.map((t) => (
                      <span
                        key={t.id}
                        className="px-2.5 py-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200 text-xs font-medium"
                      >
                        {t.t_type || t.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs italic text-zinc-400">
                      No types assigned
                    </p>
                  )}
                </div>
              </div>

              {/* EMERGENCY CONTACT */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                  Emergency Contact
                </h3>
                <div className="space-y-3.5">
                  <ProfileInfoItem
                    icon={<PersonIcon sx={{ fontSize: 13 }} />}
                    label="Contact Name"
                    value={profile.emergency?.contact_name}
                  />
                  <ProfileInfoItem
                    icon={<PhoneIcon sx={{ fontSize: 13 }} />}
                    label="Phone"
                    value={profile.emergency?.phone}
                    isMono
                  />
                  <ProfileInfoItem
                    icon={<BadgeIcon sx={{ fontSize: 13 }} />}
                    label="Relationship"
                    value={profile.emergency?.relationship}
                  />
                </div>
              </div>
            </div>

            {/* SCHEDULES LAYOUT */}
            <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2 mb-4">
                <CalendarMonthIcon
                  sx={{ fontSize: 14 }}
                  className="text-zinc-400"
                />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                  Training Schedules
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {profile.schedules?.length > 0 ? (
                  profile.schedules.map((s) => (
                    <div
                      key={s.id}
                      className="flex justify-between items-center px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl"
                    >
                      <span className="text-zinc-800 dark:text-zinc-200 text-xs font-medium uppercase font-mono">
                        {s.date || s.day}
                      </span>
                      <span className="text-[10px] font-mono font-bold border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2 py-0.5 rounded shadow-sm text-zinc-700 dark:text-zinc-300">
                        {s.time || `${s.startTime} - ${s.endTime}`}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic text-zinc-400 col-span-full">
                    No schedules assigned
                  </p>
                )}
              </div>
            </div>

            {/* COACHES LAYOUT */}
            <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono mb-4">
                Assigned Coaches
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.coaches?.length > 0 ? (
                  profile.coaches.map((coach) => (
                    <div
                      key={coach.id}
                      className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-3.5"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                        {coach.url ? (
                          <img
                            src={coach.url}
                            alt={coach.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400">
                            <PersonIcon sx={{ fontSize: 20 }} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                          {coach.name}
                        </h4>
                        <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
                          {coach.phone || "No phone added"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic text-zinc-400 col-span-full">
                    No coaches assigned
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* HELPER COMPONENTS */

function ProfileInfoItem({ icon, label, value, isMono = false }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-1.5 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 shrink-0 mt-0.5 flex items-center justify-center">
        {icon}
      </div>

      <div className="min-w-0 space-y-0.5">
        <p className="text-[9px] font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-wider font-mono">
          {label}
        </p>
        <p
          className={`text-xs tracking-tight truncate ${
            value
              ? "text-zinc-900 dark:text-zinc-200 font-medium"
              : "text-zinc-400 dark:text-zinc-600 italic"
          } ${isMono ? "font-mono" : ""}`}
        >
          {value || "None"}
        </p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] animate-pulse p-12 flex justify-center items-center">
      <div className="w-full max-w-6xl h-150 bg-white dark:bg-zinc-900/20 rounded-2xl border border-zinc-200 dark:border-zinc-800" />
    </div>
  );
}

export default MemberProfile;
