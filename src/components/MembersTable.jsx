import React, { useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function MembersTable({
  members = [],
  loading,
  page,
  setPage,
  totalPages,
  limit,
}) {
  const [search, setSearch] = useState("");

  const filteredMembers = useMemo(() => {
    if (!search) return members;
    return members.filter(
      (m) =>
        (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (m.ras_id || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [members, search]);

  if (loading) return <TableSkeleton limit={limit} />;

  return (
    <div className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/[0.05] rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl transition-all duration-300">
      {/* HEADER SECTION */}
      <div className="px-6 py-6 border-b border-zinc-100 dark:border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
            Active Members
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5 font-medium">
            Reviewing {filteredMembers.length} community profiles
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon
              className="text-zinc-400 group-focus-within:text-indigo-500 transition-colors"
              sx={{ fontSize: 18 }}
            />
          </div>
          <input
            type="text"
            placeholder="Search directory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full md:w-72 pl-10 pr-3 py-2.5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/[0.05] rounded-xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm dark:shadow-none"
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 dark:bg-white/[0.02] text-zinc-500 dark:text-zinc-500 uppercase text-[10px] font-bold tracking-[0.15em]">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Identity</th>
              <th className="px-6 py-4">Registry ID</th>
              <th className="px-6 py-4">Gender</th>
              <th className="px-6 py-4 text-center">Payment Status</th>
              <th className="px-6 py-4 text-right pr-10">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-white/[0.05]">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((m, i) => (
                <tr
                  key={m.id || i}
                  className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-colors group cursor-default"
                >
                  <td className="px-6 py-5 text-[11px] text-zinc-400 font-mono">
                    {((page - 1) * limit + i + 1).toString().padStart(2, "0")}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {m.name}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-medium mt-0.5">
                        {m.phone || "No contact"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-mono font-bold tracking-tight">
                      {m.ras_id}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-xs text-zinc-500 font-medium">
                    {m.gender}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <StatusBadge paid={m.payment_status} />
                  </td>
                  <td className="px-6 py-5 text-right pr-10">
                    <button className="p-2 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-all">
                      <MoreVertIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-20 text-center text-zinc-400 italic text-sm"
                >
                  No results found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINATION */}
      <div className="px-6 py-5 bg-zinc-50/50 dark:bg-[#09090b] border-t border-zinc-100 dark:border-white/[0.05] flex items-center justify-center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          size="small"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "rgb(161 161 170)", // zinc-400
              borderColor: "transparent",
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.05)",
              },
            },
            "& .Mui-selected": {
              backgroundColor: "rgb(79 70 229) !important", // indigo-600
              color: "#fff !important",
            },
          }}
        />
      </div>
    </div>
  );
}

const StatusBadge = ({ paid }) => {
  const styles = paid
    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20"
    : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles}`}
    >
      <span
        className={`w-1 h-1 rounded-full mr-2 ${paid ? "bg-emerald-500" : "bg-rose-500"}`}
      />
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
};

// Modern Skeleton Loader
const TableSkeleton = ({ limit }) => (
  <div className="w-full bg-white dark:bg-[#09090b] rounded-2xl border border-zinc-200 dark:border-white/[0.05] animate-pulse overflow-hidden">
    <div className="h-20 border-b border-zinc-100 dark:border-white/[0.05]" />
    {[...Array(limit)].map((_, i) => (
      <div
        key={i}
        className="h-16 border-b border-zinc-50 dark:border-white/[0.02]"
      />
    ))}
  </div>
);

export default MembersTable;
