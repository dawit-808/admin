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
        if (res.data.success) setStats(res.data.data);
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
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303]">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 px-6 py-5">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            Statistics
          </h1>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Members"
            value={stats.totalMembers}
            subtitle="Registered members"
            icon={<GroupIcon sx={{ fontSize: 10 }} />}
          />
          <StatCard
            title="Active Members"
            value={stats.activeMembers}
            subtitle={`${activePercent}% active`}
            icon={<CheckCircleOutlineIcon sx={{ fontSize: 10 }} />}
          />
          <StatCard
            title="Total Revenue"
            value={`ETB ${stats.totalRevenue.toLocaleString()}`}
            subtitle="All-time revenue"
            icon={<PaymentsIcon sx={{ fontSize: 10 }} />}
          />
          <StatCard
            title="Coaches"
            value={stats.totalCoaches}
            subtitle="Active staff"
            icon={<PersonOutlineIcon sx={{ fontSize: 10 }} />}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 mt-5">
          <RevenueChart stats={stats} />
          <CoachWorkload
            data={stats.coachStats}
            totalMembers={stats.totalMembers}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2 mt-5">
          <TrainingChart
            data={stats.trainingStats}
            totalMembers={stats.totalMembers}
          />
          <GenderChart data={stats.genderStats} />
        </div>
      </main>
    </div>
  );
}

export default Statistics;
