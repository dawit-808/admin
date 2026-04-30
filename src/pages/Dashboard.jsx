import { useEffect, useState, useContext } from "react";
import api from "../api/api";
import MembersTable from "../components/MembersTable";
import Sidebar from "../components/Sidebar";
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

  const fetchMembers = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await api.get(`/members?page=${pageNumber}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMembers(res.data.data);
      setTotalPages(res.data.totalPages);
      console.log(res);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(page);
    console.log(members);
  }, [page, accessToken]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans antialiased">
      {/* SIDEBAR - Fixed width, no extra borders */}
      <Sidebar />

      {/* MAIN CONTENT AREA - Offset by sidebar width */}
      <main className="ml-20 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-8 py-12 space-y-12">
          {/* MINIMALIST HEADER */}
          <header className="space-y-1">
            <h1 className="text-xl font-medium text-zinc-100 tracking-tight">
              Overview
            </h1>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>Gym Management</span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span>
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          {/* STATS GRID - Flat & Refined */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05] border border-white/[0.05] rounded-xl overflow-hidden">
            <StatCard
              title="Total Members"
              value="1,284"
              icon={<GroupIcon sx={{ fontSize: 18 }} />}
              subtext="+12% from last month"
            />
            <StatCard
              title="Monthly Revenue"
              value="$14,200"
              icon={<PaymentsIcon sx={{ fontSize: 18 }} />}
              subtext="94% collection rate"
            />
            <StatCard
              title="Active Now"
              value="42"
              icon={<RadarIcon sx={{ fontSize: 18 }} />}
              subtext="Real-time check-ins"
              isLive
            />
          </div>

          {/* TABLE SECTION - No extra containers or glows */}
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

/** * Refined Stat Card
 */
function StatCard({ title, value, icon, subtext, isLive }) {
  return (
    <div className="bg-[#09090b] p-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-zinc-500">{icon}</span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
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
        <h3 className="text-3xl font-light text-zinc-100 tracking-tight">
          {value}
        </h3>
        <p className="text-[11px] text-zinc-600 mt-1">{subtext}</p>
      </div>
    </div>
  );
}

export default Dashboard;
