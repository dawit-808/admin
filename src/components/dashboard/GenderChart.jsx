import { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#6366f1", "#ec4899", "#10b981"];

function CustomTooltip({ active, payload, total }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: item.payload.fill }}
        />
        <span className="font-medium text-zinc-800 dark:text-zinc-100">
          {item.name}
        </span>
      </div>
      <div className="mt-0.5 text-zinc-500">
        {item.value} members · {percent}%
      </div>
    </div>
  );
}

function GenderChart({ data }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (!data || data.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Gender Distribution
          </h2>
        </div>
        <div className="flex h-52 items-center justify-center text-sm text-zinc-400">
          No data available.
        </div>
      </section>
    );
  }

  const total = data.reduce((sum, d) => sum + d.total, 0);
  const colored = data.map((d, i) => ({
    ...d,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Gender Distribution
        </h2>
      </div>

      <div className="flex items-center gap-4 px-5 pb-5">
        <div className="relative h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={colored}
                dataKey="total"
                nameKey="gender"
                innerRadius={54}
                outerRadius={72}
                paddingAngle={4}
                stroke="none"
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {colored.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.fill}
                    opacity={
                      activeIndex === null || activeIndex === index ? 1 : 0.35
                    }
                    style={{ transition: "opacity 150ms ease" }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
              {total}
            </span>
            <span className="text-xs text-zinc-400">members</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {colored.map((entry, i) => {
            const percent =
              total > 0 ? Math.round((entry.total / total) * 100) : 0;
            return (
              <div
                key={entry.gender}
                className="flex cursor-default items-center justify-between gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">
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
    </section>
  );
}

export default GenderChart;
