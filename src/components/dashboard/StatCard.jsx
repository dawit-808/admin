import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

const ACCENTS = {
  indigo:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
};

function StatCard({ title, value, subtitle, icon, accent = "indigo", trend }) {
  const trendConfig = {
    up: { Icon: TrendingUpIcon, color: "text-emerald-500" },
    down: { Icon: TrendingDownIcon, color: "text-rose-500" },
    flat: { Icon: TrendingFlatIcon, color: "text-zinc-400" },
  };
  const t = trend ? trendConfig[trend.direction] : null;

  return (
    <div className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${ACCENTS[accent]}`}
        >
          {icon}
        </div>

        {t && (
          <div
            className={`flex items-center gap-0.5 text-xs font-semibold ${t.color}`}
          >
            <t.Icon sx={{ fontSize: 16 }} />
            {trend.value}
          </div>
        )}
      </div>

      <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
        {value}
      </h2>

      <p className="mt-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {title}
      </p>

      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500">
        {subtitle}
      </p>
    </div>
  );
}

export default StatCard;
