import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

function MembersTable({
  members = [],
  loading,
  page,
  setPage,
  totalPages,
  limit,
  searchTerm,
  setSearchTerm,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
      {/* ── HEADER ── */}
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/30 dark:bg-zinc-900/10">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white tracking-tight">
            Active Members
          </h2>
        </div>

        {/* Search Field */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <SearchIcon
              className="text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors"
              sx={{ fontSize: 16 }}
            />
          </div>
          <input
            type="text"
            placeholder="Search name, phone, registry ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full sm:w-72 pl-9 pr-4 py-2 bg-white dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/10 focus:border-zinc-400 dark:focus:border-zinc-700 transition-all"
          />
        </div>
      </div>

      {/* ── DATA TABLE ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800 text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
              <th className="px-6 py-3.5 w-16">#</th>
              <th className="px-6 py-3.5">Identity</th>
              <th className="px-6 py-3.5">Location</th>
              <th className="px-6 py-3.5">Registry ID</th>
              <th className="px-6 py-3.5 text-center w-28">Status</th>
              <th className="px-6 py-3.5 text-right pr-8 w-20">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {loading ? (
              /* Realistic Multi-Column Skeleton Loader */
              [...Array(limit)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4.5">
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-4"></div>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0"></div>
                      <div className="space-y-2 w-full max-w-[140px]">
                        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                        <div className="h-2.5 bg-zinc-100 dark:bg-zinc-900 rounded w-2/3"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="h-3 bg-zinc-100 dark:bg-zinc-900 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-16"></div>
                  </td>
                  <td className="px-6 py-4.5">
                    <div className="h-5 bg-zinc-100 dark:bg-zinc-900 rounded-full w-14 mx-auto"></div>
                  </td>
                  <td className="px-6 py-4.5 text-right pr-8">
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-4 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : members.length > 0 ? (
              members.map((m, i) => {
                const indexNumber = ((page - 1) * limit + i + 1)
                  .toString()
                  .padStart(2, "0");
                const initial = m.name ? m.name.charAt(0).toUpperCase() : "?";

                return (
                  <tr
                    key={m.id || i}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors group"
                  >
                    {/* Indexed Counter */}
                    <td className="px-6 py-4 text-xs text-zinc-400 font-mono">
                      {indexNumber}
                    </td>

                    {/* Member Core Identity with Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-center text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase shrink-0">
                          {initial}
                        </div>
                        <div className="flex flex-col">
                          <span
                            onClick={() => navigate(`/profile/${m.id}`)}
                            className=" text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                          >
                            {m.name}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-mono mt-0.5">
                            {m.phone || "—"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Left-joined Address Fields */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        {m.sub_city || m.woreda ? (
                          <span>
                            {m.sub_city || "—"}
                            <span className="text-zinc-300 dark:text-zinc-700 mx-1.5">
                              •
                            </span>
                            <span className="text-zinc-400">
                              Woreda {m.woreda || "—"}
                            </span>
                          </span>
                        ) : (
                          <span className="text-zinc-400 italic">
                            No address data
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Monospaced Registry ID */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono font-medium tracking-tight">
                        {m.ras_id || "Unassigned"}
                      </span>
                    </td>

                    {/* AI-Style Status Pill */}
                    <td className="px-6 py-4 text-center">
                      <StatusBadge paid={m.payment_status} />
                    </td>

                    {/* Action Dropdown Menu Button */}
                    <td className="px-6 py-4 text-right pr-8">
                      <button className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 active:scale-95 transition-all cursor-pointer">
                        <MoreVertIcon sx={{ fontSize: 16 }} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              /* Clean Empty State */
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-20 text-center text-zinc-400 text-xs"
                >
                  <div className="max-w-xs mx-auto space-y-1">
                    <p className="font-medium text-zinc-700 dark:text-zinc-300">
                      No members found
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      We couldn't find matches for your current keyword search
                      settings.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── PAGINATION CONTROLS ── */}
      <div className="px-6 py-4.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-center bg-zinc-50/20 dark:bg-zinc-900/5">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          size="small"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "rgb(161 161 170)",
              fontSize: "11px",
              fontFamily: "monospace",
              borderRadius: "9999px",
              "&:hover": {
                backgroundColor: "rgba(244, 244, 245, 0.1)",
              },
            },
            "& .Mui-selected": {
              backgroundColor: "rgb(24 24 27) !important", // Match dark zinc-900 layout
              color: "#ffffff !important",
              ".dark &": {
                backgroundColor: "#ffffff !important", // White selection node in dark-mode
                color: "rgb(9 9 11) !important",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

const StatusBadge = ({ paid }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
      paid
        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
    }`}
  >
    {paid ? "Paid" : "Unpaid"}
  </span>
);

export default MembersTable;
