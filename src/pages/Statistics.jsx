import { useContext, useEffect, useState } from "react";
import api from "../api/api";

import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import AuthLoader from "../components/AuthLoader";

import { AuthContext } from "../context/AuthContext";

import StatCard from "../components/dashboard/StatCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import TrainingChart from "../components/dashboard/TrainingChart";
import GenderChart from "../components/dashboard/GenderChart";
import CoachWorkload from "../components/dashboard/CoachWorkload";

// Icons
import GroupIcon from "@mui/icons-material/Group";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaymentsIcon from "@mui/icons-material/Payments";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

function Statistics() {
  const { accessToken } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    expiredMembers: 0,

    totalCoaches: 0,

    totalRevenue: 0,
    monthlyRevenue: 0,
    todayRevenue: 0,
    todayPayments: 0,

    genderStats: [],
    trainingStats: [],
    coachStats: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats");

        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [accessToken]);

  if (loading) return <AuthLoader />;

  const activePercent =
    stats.totalMembers > 0
      ? Math.round((stats.activeMembers / stats.totalMembers) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 px-8 py-8">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Statistics
          </h1>

          <p className="text-zinc-500 mt-1">
            Overview of your gym performance.
          </p>
        </div>

        {/* Stats */}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            subtitle="Registered members"
            icon={<GroupIcon sx={{ fontSize: 20 }} />}
            accent="indigo"
          />

          <StatCard
            title="Active Members"
            value={stats.activeMembers}
            subtitle={`${activePercent}% active`}
            icon={<CheckCircleOutlineIcon sx={{ fontSize: 20 }} />}
            accent="emerald"
          />

          <StatCard
            title="Total Revenue"
            value={`ETB ${stats.totalRevenue.toLocaleString()}`}
            subtitle="All-time revenue"
            icon={<PaymentsIcon sx={{ fontSize: 20 }} />}
            accent="amber"
          />

          <StatCard
            title="Coaches"
            value={stats.totalCoaches}
            subtitle="Active staff"
            icon={<PersonOutlineIcon sx={{ fontSize: 20 }} />}
            accent="rose"
          />
        </div>

        {/* Revenue */}

        <div className="mt-8">
          <RevenueChart stats={stats} />
        </div>

        {/* Bottom */}

        <div className="grid gap-6 lg:grid-cols-2 mt-8">
          <TrainingChart
            data={stats.trainingStats}
            totalMembers={stats.totalMembers}
          />

          <GenderChart
            data={stats.genderStats}
            totalMembers={stats.totalMembers}
          />
        </div>

        {/* Coach */}

        <div className="mt-8">
          <CoachWorkload
            data={stats.coachStats}
            totalMembers={stats.totalMembers}
          />
        </div>
      </main>
    </div>
  );
}

export default Statistics;
