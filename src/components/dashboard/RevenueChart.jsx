import { useState } from "react";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

function RevenueRow({ label, value, max, color }) {
  const [hovered, setHovered] = useState(false);
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wide text-zinc-400">
          {label}
        </span>
        <span
          className={`text-sm font-semibold text-zinc-900 dark:text-white transition-transform ${
            hovered ? "scale-105" : ""
          }`}
        >
          ETB {value.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-900">
        <div
          className={`h-full rounded-sm ${color} transition-all duration-700 ease-out`}
          style={{ width: `${Math.max(percent, value > 0 ? 2 : 0)}%` }}
        />
      </div>
    </div>
  );
}

function RevenueChart({ stats }) {
  const max = Math.max(stats.totalRevenue, 1);

  return (
    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-md">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] uppercase tracking-wide text-zinc-400">
          Revenue Overview
        </span>
        <div className="flex items-center gap-1.5 text-xs text-emerald-500">
          <ReceiptLongOutlinedIcon sx={{ fontSize: 14 }} />
          {stats.todayPayments} payments today
        </div>
      </div>

      <div className="space-y-3 px-4 pb-4">
        <RevenueRow
          label="Today"
          value={stats.todayRevenue}
          max={max}
          color="bg-emerald-500"
        />
        <RevenueRow
          label="This Month"
          value={stats.monthlyRevenue}
          max={max}
          color="bg-zinc-500"
        />
        <RevenueRow
          label="All-Time"
          value={stats.totalRevenue}
          max={max}
          color="bg-zinc-400 dark:bg-zinc-700"
        />
      </div>
    </div>
  );
}

export default RevenueChart;
