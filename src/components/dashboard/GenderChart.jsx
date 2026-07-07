import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const GENDER_COLORS = {
  male: "#52525b",
  female: "#10b981",
  other: "#a1a1aa",
};

function colorFor(gender) {
  return GENDER_COLORS[gender?.toLowerCase()] || GENDER_COLORS.other;
}

function CustomTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;

  return (
    <div className="bg-[#09090b] px-3 py-2 text-sm border border-zinc-800">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: item.payload.fill }}
        />
        <span className="font-medium text-white">{item.name}</span>
      </div>
      <div className="mt-0.5 text-zinc-400">
        {item.value} members · {percent}%
      </div>
    </div>
  );
}

function GenderChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-md p-4">
        <span className="text-[10px] uppercase tracking-wide text-zinc-400">
          Gender Distribution
        </span>
        <div className="flex h-32 items-center justify-center text-sm text-zinc-500">
          No data available.
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.total, 0);
  const colored = data.map((d) => ({ ...d, fill: colorFor(d.gender) }));

  return (
    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-md p-4">
      <span className="text-[10px] uppercase tracking-wide text-zinc-400">
        Gender Distribution
      </span>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-28 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={colored}
                dataKey="total"
                nameKey="gender"
                innerRadius={38}
                outerRadius={52}
                paddingAngle={3}
                stroke="none"
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {colored.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.fill}
                    opacity={
                      activeIndex === null || activeIndex === i ? 1 : 0.35
                    }
                    style={{ transition: "opacity 150ms ease" }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-zinc-900 dark:text-white">
              {total}
            </span>
            <span className="text-[9px] uppercase text-zinc-400">members</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {colored.map((entry, i) => {
            const percent =
              total > 0 ? Math.round((entry.total / total) * 100) : 0;
            return (
              <div
                key={entry.gender}
                className="flex items-center justify-between"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-xs uppercase text-zinc-400">
                    {entry.gender}
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {percent}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GenderChart;
