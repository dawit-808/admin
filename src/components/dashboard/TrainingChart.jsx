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

function CustomTooltip({ active, payload, totalMembers }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const percent =
    totalMembers > 0 ? Math.round((item.value / totalMembers) * 100) : 0;

  return (
    <div className="bg-[#09090b] border border-zinc-800 px-3 py-2 text-sm">
      <div className="text-white">{item.payload.t_type}</div>
      <div className="mt-0.5 text-zinc-400">
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
    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-md">
      <div className="px-4 py-3">
        <span className="text-[10px] uppercase tracking-wide text-zinc-400">
          Training Distribution
        </span>
      </div>

      <div className="h-44 px-2 pb-3">
        {sorted.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              onMouseMove={(s) =>
                setActiveIndex(s?.isTooltipActive ? s.activeTooltipIndex : null)
              }
              onMouseLeave={() => setActiveIndex(null)}
            >
              <XAxis
                dataKey="t_type"
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#71717a" }}
                width={28}
              />
              <Tooltip
                content={<CustomTooltip totalMembers={totalMembers} />}
                cursor={{ fill: "#71717a", opacity: 0.08 }}
              />
              <Bar dataKey="members" radius={[3, 3, 0, 0]} maxBarSize={40}>
                {sorted.map((entry, index) => (
                  <Cell
                    key={entry.t_type}
                    fill={index === 0 ? "#10b981" : "#71717a"}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.4
                    }
                    style={{ transition: "opacity 150ms ease" }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default TrainingChart;
