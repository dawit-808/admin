import React, { useState, useMemo } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import MoreVertIcon from "@mui/icons-material/MoreVert";

/**
 * Refactored MembersTable
 * @param {Array} members - The array of member objects from the API
 * @param {boolean} loading - Loading state
 * @param {number} page - Current active page
 * @param {function} setPage - State setter for page
 * @param {number} totalPages - Total pages from backend
 * @param {number} limit - Items per page
 */
function MembersTable({
  members = [],
  loading,
  page,
  setPage,
  totalPages,
  limit,
}) {
  const [search, setSearch] = useState("");

  // Memoize filtering to prevent recalculation on unrelated re-renders
  // Note: For large datasets, searching should happen on the server-side.
  const filteredMembers = useMemo(() => {
    if (!search) return members;
    return members.filter(
      (m) =>
        (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (m.ras_id || "").toLowerCase().includes(search.toLowerCase()),
    );
  }, [members, search]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-500 text-sm animate-pulse">
          Loading members...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#111827] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      {/* HEADER SECTION */}
      <div className="px-6 py-5 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Active Members
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Manage and monitor your community list
          </p>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon
              className="text-gray-500 group-focus-within:text-blue-500 transition-colors"
              fontSize="small"
            />
          </div>
          <input
            type="text"
            placeholder="Search name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full md:w-72 pl-10 pr-3 py-2 bg-[#1F2937] border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all hover:border-gray-600"
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1F2937]/50 text-gray-400 uppercase text-[11px] font-bold tracking-wider">
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Member Info</th>
              <th className="px-6 py-4">Ras ID</th>
              <th className="px-6 py-4">Gender</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((m, i) => (
                <tr
                  key={m.id || i}
                  className="hover:bg-[#1F2937]/30 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {((page - 1) * limit + i + 1).toString().padStart(2, "0")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {m.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {m.phone || "No phone"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-blue-400/80">
                    {m.ras_id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300 capitalize">
                    {m.gender}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge paid={m.payment_status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="p-1 rounded-md text-gray-500 hover:text-white hover:bg-gray-700 transition-all"
                      aria-label="Actions"
                    >
                      <MoreVertIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-500 italic"
                >
                  No members found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER / PAGINATION */}
      <div className="px-6 py-4 bg-[#111827] border-t border-gray-800 flex items-center justify-center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          size="medium"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "#9CA3AF",
              borderColor: "#374151",
              "&:hover": {
                backgroundColor: "#1F2937",
              },
            },
            "& .Mui-selected": {
              backgroundColor: "#2563EB !important",
              color: "#fff",
              fontWeight: "bold",
            },
            "& .MuiPaginationItem-ellipsis": { color: "#4B5563" },
          }}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
}

// Sub-component for cleaner code
const StatusBadge = ({ paid }) => {
  const styles = paid
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : "bg-rose-500/10 text-rose-400 border-rose-500/20";

  const dotStyles = paid ? "bg-emerald-400" : "bg-rose-400";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotStyles}`} />
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
};

export default MembersTable;
