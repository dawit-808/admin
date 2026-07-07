import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#8b5cf6",
];

function CustomTooltip({ active, payload, totalMembers }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const percent =
    totalMembers > 0 ? Math.round((item.value / totalMembers) * 100) : 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
      <div className="font-medium text-zinc-800 dark:text-zinc-100">
        {item.payload.t_type}
      </div>
      <div className="mt-0.5 text-zinc-500">
        {item.value} members · {percent}%
      </div>
    </div>
  );
}

function TrainingChart({ data, totalMembers }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const sorted =
    data && data.length ? [...data].sort((a, b) => b.members - a.members) : [];

  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Training Distribution
        </h2>
        <p className="mt-0.5 text-xs text-zinc-400">
          Members grouped by training program
        </p>
      </div>

      <div className="h-56 px-3 pb-4">
        {sorted.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            No data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              onMouseMove={(state) => {
                if (state?.isTooltipActive) {
                  setActiveIndex(state.activeTooltipIndex);
                } else {
                  setActiveIndex(null);
                }
              }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <XAxis
                dataKey="t_type"
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#a1a1aa" }}
                width={28}
              />
              <Tooltip
                content={<CustomTooltip totalMembers={totalMembers} />}
                cursor={{ fill: "#a1a1aa", opacity: 0.08 }}
              />
              <Bar dataKey="members" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {sorted.map((entry, index) => (
                  <Cell
                    key={entry.t_type}
                    fill={COLORS[index % COLORS.length]}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.45
                    }
                    style={{ transition: "opacity 150ms ease" }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

export default TrainingChart;
