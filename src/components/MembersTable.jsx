import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import { sampleMembers } from "./sampleMembers";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#3B82F6" },
    text: { primary: "#E5E7EB" },
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

  const filtered = members
    .filter((m) => m.fullName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <ThemeProvider theme={theme}>
      <div className="rounded shadow p-4 bg-[#0D1421] text-white">
        {/* Header */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg text-blue-500 font-semibold">Members</h2>
          <div className="flex items-center bg-gray-800 border border-gray-600 rounded-full px-4 hover:border-blue-500 focus-within:border-blue-500 transition-colors duration-200">
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
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-700 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-[#1A2233] text-gray-300 text-sm uppercase">
              <tr>
                <th className="px-4 py-2 border-b border-gray-600">#</th>
                <th className="px-4 py-2 border-b border-gray-600 text-left">
                  Name
                </th>
                <th className="px-4 py-2 border-b border-gray-600 text-left">
                  Phone
                </th>
                <th className="px-4 py-2 border-b border-gray-600 text-left">
                  Type
                </th>
                <th className="px-4 py-2 border-b border-gray-600 text-left">
                  Schedule
                </th>
                <th className="px-4 py-2 border-b border-gray-600 text-left">
                  Package
                </th>
                <th className="px-4 py-2 border-b border-gray-600 text-center">
                  Paid
                </th>
                <th className="px-4 py-2 border-b border-gray-600 text-center">
                  Expires
                </th>
                <th className="px-4 py-2 border-b border-gray-600 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {paginated.map((member, index) => (
                <tr key={member.id || index} className="hover:bg-[#1F2A40]">
                  <td className="px-4 py-2 border-b border-gray-700 text-center">
                    {(page - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {member.fullName}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {member.phoneNumber}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {member.trainingType}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {member.trainingSchedule}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {member.membershipPackage}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-center">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                        member.paymentStatus === "Paid"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {member.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-center">
                    {member.membershipExpiryDate}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-center space-x-2">
                    <button className="text-blue-400 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-400 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
