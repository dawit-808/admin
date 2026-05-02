import { useEffect, useState, useContext } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

// MUI Icons
import GroupIcon from "@mui/icons-material/Group";
import PaymentsIcon from "@mui/icons-material/Payments";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import BarChartIcon from "@mui/icons-material/BarChart";
import DateRangeIcon from "@mui/icons-material/DateRange";

function Statistics() {
  const { accessToken } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalMembers: 0,
    paid: 0,
    unpaid: 0,
    warning: 0,
    trainingType: [],
    schedule: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [accessToken]);

  const paymentRate =
    stats.totalMembers > 0
      ? Math.round((stats.paid / stats.totalMembers) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-500">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 px-6 md:px-12 py-10 max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Dashboard Analytics
          </h1>
          <p className="text-sm text-zinc-500">
            Real-time performance metrics and member distribution
          </p>
        </header>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            icon={
              <GroupIcon className="text-indigo-500 dark:text-indigo-400" />
            }
            color="indigo"
          />
          <StatCard
            title="Paid"
            value={stats.paid}
            icon={
              <PaymentsIcon className="text-emerald-500 dark:text-emerald-400" />
            }
            color="emerald"
          />
          <StatCard
            title="Unpaid"
            value={stats.unpaid}
            icon={
              <CancelOutlinedIcon className="text-rose-500 dark:text-rose-400" />
            }
            color="rose"
          />
          <StatCard
            title="Warning"
            value={stats.warning}
            icon={
              <WarningAmberIcon className="text-amber-500 dark:text-amber-400" />
            }
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PAYMENT HEALTH - VISUAL CHART */}
          <div className="lg:col-span-1 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/[0.05] rounded-2xl p-8 flex flex-col items-center justify-center text-center relative group overflow-hidden shadow-sm dark:shadow-none transition-colors">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-300 mb-6 self-start uppercase tracking-widest text-[10px]">
              Payment Health
            </h2>

            <div className="relative flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="66"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-zinc-200 dark:text-zinc-800"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="66"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={414.6}
                  strokeDashoffset={414.6 - (414.6 * paymentRate) / 100}
                  className="text-indigo-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {paymentRate}%
                </span>
                <span className="text-[10px] text-zinc-500 uppercase font-bold">
                  Paid
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-6">
              Average collection rate based on <br /> {stats.totalMembers}{" "}
              active profiles
            </p>
          </div>

          {/* TRAINING TYPE DISTRIBUTION */}
          <Section
            title="Training Breakdown"
            icon={<BarChartIcon fontSize="small" />}
          >
            {stats.trainingType.length > 0 ? (
              stats.trainingType.map((item, i) => (
                <BarRow
                  key={i}
                  label={item.type}
                  value={item.count}
                  total={stats.totalMembers}
                  color="bg-indigo-500"
                />
              ))
            ) : (
              <p className="text-xs text-zinc-400 italic">No data available</p>
            )}
          </Section>

          {/* SCHEDULE DISTRIBUTION */}
          <Section
            title="Shift Activity"
            icon={<DateRangeIcon fontSize="small" />}
          >
            {stats.schedule.length > 0 ? (
              stats.schedule.map((item, i) => (
                <BarRow
                  key={i}
                  label={item.schedule}
                  value={item.count}
                  total={stats.totalMembers}
                  color="bg-zinc-400 dark:bg-zinc-500"
                />
              ))
            ) : (
              <p className="text-xs text-zinc-400 italic">No data available</p>
            )}
          </Section>
        </div>
      </main>
    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function StatCard({ title, value, icon, color }) {
  const borderColors = {
    indigo: "group-hover:border-indigo-500/50",
    emerald: "group-hover:border-emerald-500/50",
    rose: "group-hover:border-rose-500/50",
    amber: "group-hover:border-amber-500/50",
  };

  return (
    <div
      className={`p-6 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/[0.05] rounded-2xl flex flex-col gap-4 transition-all duration-300 group hover:shadow-lg dark:hover:shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-900/60 ${borderColors[color]}`}
    >
      <div className="p-2 bg-zinc-100 dark:bg-black/20 rounded-xl w-fit border border-zinc-200 dark:border-white/[0.03]">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          {title}
        </p>
        <h3 className="text-3xl font-semibold text-zinc-900 dark:text-white mt-1">
          {value.toLocaleString()}
        </h3>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/[0.05] rounded-2xl p-6 relative group overflow-hidden shadow-sm dark:shadow-none transition-colors">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-zinc-400 dark:text-zinc-500">{icon}</span>
        <h2 className="text-xs font-bold text-zinc-500 dark:text-zinc-300 uppercase tracking-widest">
          {title}
        </h2>
      </div>
      <div className="space-y-5 relative z-10">{children}</div>
    </div>
  );
}

function BarRow({ label, value, total, color }) {
  const percent = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="group/row">
      <div className="flex justify-between text-[11px] mb-1.5">
        <span className="text-zinc-500 dark:text-zinc-400 group-hover/row:text-indigo-600 dark:group-hover/row:text-zinc-200 transition-colors uppercase font-medium">
          {label}
        </span>
        <span className="text-zinc-900 dark:text-zinc-300 font-mono font-bold">
          {value}
        </span>
      </div>
      <div className="w-full h-1.5 bg-zinc-100 dark:bg-white/[0.03] rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_8px_rgba(0,0,0,0.05)]`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}

export default Statistics;
