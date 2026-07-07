function CoachWorkload({ data, totalMembers }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-md p-4">
        <span className="text-[10px] uppercase tracking-wide text-zinc-400">
          Coach Workload
        </span>
        <div className="flex h-32 items-center justify-center text-sm text-zinc-500">
          No coach data available.
        </div>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.members - a.members);
  const avgLoad = totalMembers / sorted.length;

  return (
    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-md">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-[10px] uppercase tracking-wide text-zinc-400">
          Coach Workload
        </span>
        <span className="text-[10px] text-zinc-500">
          {sorted.length} coaches
        </span>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-900 max-h-64 overflow-y-auto">
        {sorted.map((coach, i) => {
          const percent =
            totalMembers > 0 ? (coach.members / totalMembers) * 100 : 0;
          const overloaded = coach.members > avgLoad * 1.4;
          const isTop = i === 0;

          return (
            <div
              key={coach.name}
              className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
            >
              <span className="w-4 shrink-0 text-xs text-zinc-500">
                {i + 1}
              </span>

              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">
                    {coach.name}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {overloaded && (
                      <span className="text-[10px] uppercase tracking-wide text-rose-500">
                        Overloaded
                      </span>
                    )}
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {coach.members}
                    </span>
                  </div>
                </div>

                <div className="h-1 overflow-hidden rounded-sm bg-zinc-100 dark:bg-zinc-900">
                  <div
                    className={`h-full rounded-sm transition-all duration-500 ${
                      isTop ? "bg-emerald-500" : "bg-zinc-400 dark:bg-zinc-600"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CoachWorkload;
