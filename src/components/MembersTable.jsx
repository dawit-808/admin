import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import { sampleMembers } from "./SampleMembers";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#3B82F6" }, // blue-500
    text: { primary: "#6B7280" }, // gray-500
  },
});

function MembersTable() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setMembers(sampleMembers);
  }, []);

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <ThemeProvider theme={theme}>
      <div className="rounded shadow p-4 max-w-full overflow-x-auto bg-[#0D1421] text-white">
        {/* Header */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg text-blue-500 font-semibold">Members</h2>
          <div className="flex items-center bg-gray-800 border border-gray-600 rounded-full px-4">
            <SearchIcon className="text-blue-500" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-3 py-2 text-sm text-white bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <table className="min-w-full table-auto border-collapse border border-gray-600 text-sm">
          <thead className="bg-[#1A2332] text-gray-300">
            <tr>
              <th className="border border-gray-600 px-4 py-2 text-left">#</th>
              <th className="border border-gray-600 px-4 py-2 text-left">Id</th>
              <th className="border border-gray-600 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-600 px-4 py-2 text-left">
                Training
              </th>
              <th className="border border-gray-600 px-4 py-2 text-left">
                Status
              </th>
              <th className="border border-gray-600 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-400">
                  No members found.
                </td>
              </tr>
            ) : (
              paginated.map((member, index) => (
                <tr key={member.id} className="hover:bg-[#1f2937]">
                  <td className="border border-gray-700 px-4 py-2">
                    {(page - 1) * pageSize + index + 1}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {member.id}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {member.name}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {member.training}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        member.status === "Active"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="border border-gray-700 px-4 py-2 space-x-2">
                    <button className="text-blue-400 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-400 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default MembersTable;
