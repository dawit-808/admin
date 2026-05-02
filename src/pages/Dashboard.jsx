import { useEffect, useState, useContext } from "react";
import api from "../api/api";
import MembersTable from "../components/MembersTable";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { AuthContext } from "../context/AuthContext";

// Icons
import GroupIcon from "@mui/icons-material/Group";
import PaymentsIcon from "@mui/icons-material/Payments";
import RadarIcon from "@mui/icons-material/Radar";

function Dashboard() {
  const { accessToken } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 15;

  const [stats, setStats] = useState({
    totalMembers: 0,
    paid: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await api.get("/stats");
      setStats({
        totalMembers: res.data.totalMembers,
        paid: res.data.paid,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const fetchMembers = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await api.get(`/members?page=${pageNumber}&limit=${limit}`);
      setMembers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(page);
    fetchStats();
  }, [page, accessToken]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-500">
      <Sidebar />
      <ThemeToggle />
      <main className="ml-20 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-8 py-12 space-y-12">
          {/* HEADER */}
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Overview
            </h1>
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
              <span>Gym Management</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
              <span>
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          {/* STATS GRID - Uses border colors that adapt */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 dark:bg-white/[0.05] border border-zinc-200 dark:border-white/[0.05] rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
            <StatCard
              title="Total Members"
              value={stats.totalMembers}
              icon={<GroupIcon sx={{ fontSize: 20 }} />}
              subtext="All registered members"
            />
            <StatCard
              title="Monthly Revenue"
              value="$14,200"
              icon={<PaymentsIcon sx={{ fontSize: 20 }} />}
              subtext="94% collection rate"
            />
            <StatCard
              title="Active Now"
              value={stats.paid}
              icon={<RadarIcon sx={{ fontSize: 20 }} />}
              subtext="Real-time check-ins"
              isLive
            />
          </div>

          {/* TABLE SECTION */}
          <section className="pt-4">
            <MembersTable
              members={members}
              loading={loading}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              limit={limit}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, subtext, isLive }) {
  return (
    /* 3. Cards are white in bright mode, deep black in dark mode */
    <div className="bg-white dark:bg-[#09090b] p-8 flex flex-col gap-5 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-indigo-500 dark:text-zinc-500">{icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500">
            {title}
          </span>
        </div>
        {isLive && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        )}
      </div>
      <div>
        <h3 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {value.toLocaleString()}
        </h3>
        <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1 font-medium">
          {subtext}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
