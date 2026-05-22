import { useEffect, useState } from "react";
import api from "../api/api";
import MembersTable from "../components/MembersTable";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import AddMembers from "../components/Addmembers/AddMembers";

// Icons
import GroupIcon from "@mui/icons-material/Group";
import PaymentsIcon from "@mui/icons-material/Payments";
import RadarIcon from "@mui/icons-material/Radar";
import AddIcon from "@mui/icons-material/Add";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const limit = 15;

  // Fetch Members
  const fetchMembers = async (pageNumber, query) => {
    try {
      setLoading(true);

      const res = await api.get(
        `/members?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(
          query || "",
        )}`,
      );

      setMembers(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced Search
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      setActiveSearch(searchTerm.trim());
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Fetch Members when page OR search changes
  useEffect(() => {
    fetchMembers(page, activeSearch);
  }, [page, activeSearch]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] text-zinc-600 dark:text-zinc-400 font-sans antialiased transition-colors duration-500">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-8 py-12 space-y-12">
          {/* Flexbox header keeps title and button aligned beautifully */}
          <header className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-4">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              Members Management
            </h1>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black px-4 py-2 text-sm font-medium transition-colors duration-200 shadow-sm"
            >
              <AddIcon fontSize="small" /> Register Member
            </button>
          </header>

          {/* TABLE SECTION */}
          <section className="pt-4">
            <MembersTable
              members={members}
              loading={loading}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              limit={limit}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </section>
        </div>
      </main>

      {/* MODAL MOUNTED AT ROOT ENTRY LEVEL */}
      <AddMembers
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchMembers(page, activeSearch)}
      />
    </div>
  );
}

function StatCard({ title, value, icon, subtext, isLive }) {
  return (
    <div className="bg-white dark:bg-[#09090b] p-8 flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-[10px] uppercase text-zinc-400">{title}</span>
        </div>

        {isLive && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute w-full h-full bg-emerald-400 opacity-75 rounded-full"></span>
            <span className="relative w-2 h-2 bg-emerald-500 rounded-full"></span>
          </span>
        )}
      </div>

      <h3 className="text-4xl font-bold text-zinc-900 dark:text-white">
        {value.toLocaleString()}
      </h3>

      <p className="text-xs text-zinc-400">{subtext}</p>
    </div>
  );
}

export default Members;
