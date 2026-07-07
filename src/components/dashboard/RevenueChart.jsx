import { useState } from "react";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

function RevenueRow({ label, value, max, color, delay }) {
  const [hovered, setHovered] = useState(false);
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
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

      <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className={`h-full rounded-full ${color} transition-all ease-out`}
          style={{
            width: `${Math.max(percent, value > 0 ? 2 : 0)}%`,
            transitionDuration: `${600 + delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

function RevenueChart({ stats }) {
  const max = Math.max(stats.totalRevenue, 1);

  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Revenue Overview
          </h2>
          <p className="mt-0.5 text-xs text-zinc-400">
            Today vs. this month vs. all-time
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <ReceiptLongOutlinedIcon sx={{ fontSize: 14 }} />
          {stats.todayPayments} payments today
        </div>
      </div>

      <div className="space-y-4 px-5 pb-5">
        <RevenueRow
          label="Today"
          value={stats.todayRevenue}
          max={max}
          color="bg-amber-500"
          delay={0}
        />
        <RevenueRow
          label="This Month"
          value={stats.monthlyRevenue}
          max={max}
          color="bg-indigo-500"
          delay={100}
        />
        <RevenueRow
          label="All-Time"
          value={stats.totalRevenue}
          max={max}
          color="bg-emerald-500"
          delay={200}
        />
      </div>

      <div className="flex items-center gap-2 border-t border-zinc-100 px-5 py-3 text-xs text-zinc-400 dark:border-zinc-800">
        <PaymentsOutlinedIcon sx={{ fontSize: 14 }} />
        Bars scaled relative to all-time total
      </div>
    </section>
  );
}

export default RevenueChart;
