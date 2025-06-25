import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./Admin.module.css";
import TableHeader from "../../components/ColumnName/TableHeader";
import UserList from "../../components/UserList/UserList";

function Admin() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const LIMIT = 10;

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/users`, {
        params: {
          page,
          limit: LIMIT,
          search,
        },
      })
      .then((res) => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className={`container gx-0 ${classes.user_container}`}>
      <h2 className={classes.title}>Members</h2>

      <input
        type="text"
        placeholder="Search by name or code..."
        value={search}
        onChange={handleSearchChange}
        className={classes.searchInput}
      />

      <TableHeader />
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          {users.map((user, i) => {
            const btnClass =
              user.payment_status.toLowerCase() === "paid"
                ? classes.green
                : classes.red;

            return (
              <UserList
                key={user.id}
                order={(page - 1) * LIMIT + i + 1}
                id={user.id}
                memberCode={user.member_code}
                name={user.name}
                trainingType={user.training_type}
                trainingDay={user.training_day}
                trainingSchedule={user.training_schedule}
                paymentStatus={user.payment_status}
                btnClass={btnClass}
                onDelete={handleDelete}
              />
            );
          })}

          {/* Pagination Controls */}
          <div className={classes.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Admin;
