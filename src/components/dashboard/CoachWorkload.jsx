const PALETTE = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-sky-500",
  "bg-violet-500",
];

function colorFor(name) {
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return PALETTE[hash % PALETTE.length];
}

function CoachWorkload({ data, totalMembers }) {
  if (!data || data.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
            Coach Workload
          </h2>
        </div>
        <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
          No coach data available.
        </div>
      </section>
    );
  }

  const sorted = [...data].sort((a, b) => b.members - a.members);
  const avgLoad = totalMembers / sorted.length;

  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
          Coach Workload
        </h2>
        <span className="text-xs text-zinc-400">{sorted.length} coaches</span>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
        {sorted.map((coach, i) => {
          const percent =
            totalMembers > 0 ? (coach.members / totalMembers) * 100 : 0;
          const overloaded = coach.members > avgLoad * 1.4;
          const initials = coach.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          return (
            <div
              key={coach.name}
              className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
            >
              <span className="w-4 shrink-0 text-xs font-medium text-zinc-400">
                {i + 1}
              </span>

              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${colorFor(coach.name)}`}
              >
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {coach.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {overloaded && (
                      <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                        Overloaded
                      </span>
                    )}
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {coach.members}
                    </span>
                  </div>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colorFor(coach.name)}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CoachWorkload;
