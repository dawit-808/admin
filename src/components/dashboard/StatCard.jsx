import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

function StatCard({ title, value, subtitle, icon, trend, isLive }) {
  const trendConfig = {
    up: { Icon: TrendingUpIcon, color: "text-emerald-500" },
    down: { Icon: TrendingDownIcon, color: "text-rose-500" },
    flat: { Icon: TrendingFlatIcon, color: "text-zinc-500" },
  };
  const t = trend ? trendConfig[trend.direction] : null;

  return (
    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-md p-6 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-500">{icon}</div>

        {isLive && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
          </span>
        )}

        {!isLive && t && (
          <div
            className={`flex items-center gap-0.5 text-xs font-medium ${t.color}`}
          >
            <t.Icon sx={{ fontSize: 15 }} />
            {trend.value}
          </div>
        )}
      </div>

      <h3 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white">
        {value}
      </h3>

      <p className="mt-2 text-[10px] uppercase tracking-wide text-zinc-400">
        {title}
      </p>
      <p className="mt-0.5 text-xs text-zinc-500">{subtitle}</p>
    </div>
  );
}

export default StatCard;
