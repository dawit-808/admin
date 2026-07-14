import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BoltIcon from "@mui/icons-material/Bolt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const ACCENTS = [
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-sky-500",
  "bg-rose-500",
  "bg-fuchsia-500",
];

function accentFor(index) {
  return ACCENTS[index % ACCENTS.length];
}

// Helper to convert day codes into a readable format
function formatDays(dayString) {
  if (!dayString) return "Unscheduled";

  const upperDay = dayString.trim().toUpperCase();

  const map = {
    MWF: "Mon, Wed, Fri",
    TTS: "Tue, Thu, Sat",
  };

  return map[upperDay] || dayString;
}

function ScheduleAndtt() {
  const [trainingTypes, setTrainingTypes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ttRes, schedRes] = await Promise.all([
          api.get("/training-types"),
          api.get("/schedules"),
        ]);
        setTrainingTypes(ttRes.data || []);
        setSchedules(schedRes.data || []);
      } catch (err) {
        console.error("Failed to load training types / schedules:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Group schedules using our new readable day converter
  const groupedSchedules = schedules.reduce((groups, s) => {
    const rawDay = s.day || s.date || "Unscheduled";
    const day = formatDays(rawDay); // <-- Converts "MWF" to "Mon, Wed, Fri" right here

    if (!groups[day]) groups[day] = [];
    groups[day].push(s);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-500">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 px-6 py-10 max-w-6xl mx-auto space-y-10">
        {/* PAGE HEADER */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight">
            Training Types & Schedules
          </h1>
        </div>

        {loading ? (
          <PageSkeleton />
        ) : (
          <>
            {/* TRAINING TYPES */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FitnessCenterIcon
                    sx={{ fontSize: 16 }}
                    className="text-zinc-400"
                  />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                    Training Types
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full">
                  {trainingTypes.length} total
                </span>
              </div>

              {trainingTypes.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {trainingTypes.map((t, i) => (
                    <div
                      key={t.id}
                      className="group relative overflow-hidden bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${accentFor(i)} bg-opacity-15 flex items-center justify-center mb-3`}
                      >
                        <FitnessCenterIcon
                          sx={{ fontSize: 15 }}
                          className="text-white"
                        />
                      </div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white tracking-tight truncate">
                        {t.t_type || t.name}
                      </p>
                      {t.description && (
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                          {t.description}
                        </p>
                      )}
                      <div
                        className={`absolute top-0 right-0 w-16 h-16 ${accentFor(i)} opacity-[0.06] rounded-full blur-2xl group-hover:opacity-[0.12] transition-opacity`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState label="No training types available yet." />
              )}
            </section>

            {/* SCHEDULES */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarMonthIcon
                    sx={{ fontSize: 16 }}
                    className="text-zinc-400"
                  />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                    Available Schedules
                  </h2>
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full">
                  {schedules.length} total
                </span>
              </div>

              {schedules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Object.entries(groupedSchedules).map(([day, items]) => (
                    <div
                      key={day}
                      className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono mb-3">
                        {day}
                      </p>
                      <div className="space-y-2">
                        {items.map((s) => (
                          <div
                            key={s.id}
                            className="flex items-center justify-between px-3 py-2 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 rounded-xl"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <AccessTimeIcon
                                sx={{ fontSize: 13 }}
                                className="text-zinc-400 shrink-0"
                              />
                              <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
                                {s.time ||
                                  `${s.startTime || "?"} - ${s.endTime || "?"}`}
                              </span>
                            </div>
                            {s.t_type && (
                              <span className="text-[10px] text-zinc-400 truncate ml-2">
                                {s.t_type}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState label="No schedules available yet." />
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl py-10 flex items-center justify-center">
      <p className="text-xs italic text-zinc-400">{label}</p>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-40 bg-white dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}

export default ScheduleAndtt;
