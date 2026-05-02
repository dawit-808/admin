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

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const limit = 15;

  const [stats, setStats] = useState({ totalMembers: 0, paid: 0 });

  //  Fetch Members
  const fetchMembers = async (pageNumber, query) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/members?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(
          query || "",
        )}`,
      );

      setMembers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch Stats (ONLY ONCE)
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

  //  Debounced Search
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      setActiveSearch(searchTerm.trim());
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  //  Fetch Members when page OR search changes
  useEffect(() => {
    fetchMembers(page, activeSearch);
  }, [page, activeSearch]);

  //  Fetch stats once
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-500">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-8 py-12 space-y-12">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-white uppercase">
              Overview
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              Manage your gym ecosystem
            </p>
          </header>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-200 dark:bg-white/[0.05] border rounded-2xl overflow-hidden shadow-sm">
            <StatCard
              title="Total Members"
              value={stats.totalMembers}
              icon={<GroupIcon sx={{ fontSize: 20 }} />}
              subtext="Total registered"
            />

            <StatCard
              title="Monthly Revenue"
              value="$14,200"
              icon={<PaymentsIcon sx={{ fontSize: 20 }} />}
              subtext="Current collection"
            />

            <StatCard
              title="Active Now"
              value={stats.paid}
              icon={<RadarIcon sx={{ fontSize: 20 }} />}
              subtext="Checked in"
              isLive
            />
          </div>

          {/* TABLE */}
          <section className="pt-4">
            <MembersTable
              members={members}
              loading={loading}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              limit={limit}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, subtext, isLive }) {
  return (
    <div className="bg-white dark:bg-[#09090b] p-8 flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-[10px] uppercase text-zinc-400">{title}</span>
        </div>

        {isLive && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute w-full h-full bg-emerald-400 opacity-75 rounded-full"></span>
            <span className="relative w-2 h-2 bg-emerald-500 rounded-full"></span>
          </span>
        )}
      </div>

      <h3 className="text-4xl font-bold text-zinc-900 dark:text-white">
        {value.toLocaleString()}
      </h3>

      <p className="text-xs text-zinc-400">{subtext}</p>
    </div>
  );
}

export default Dashboard;
