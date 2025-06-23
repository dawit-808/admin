import { useEffect, useState } from "react";
import axios from "axios";
import classes from "./Admin.module.css";
import TableHeader from "../../components/ColumnName/TableHeader";
import UserList from "../../components/UserList/UserList";

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  }, []);

  // delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <div className={`container gx-0 ${classes.user_container}`}>
      <TableHeader />
      {loading ? (
        <p>Loading users...</p>
      ) : (
        users.map(
          (
            {
              id, // use this internally
              member_code, // show this instead of UUID
              name,
              training_type,
              training_day,
              training_schedule,
              payment_status,
            },
            i
          ) => {
            const btnClass =
              payment_status.toLowerCase() === "paid"
                ? classes.green
                : classes.red;

            return (
              <UserList
                key={id}
                order={i + 1}
                id={id}
                memberCode={member_code}
                name={name}
                trainingType={training_type}
                trainingDay={training_day}
                trainingSchedule={training_schedule}
                paymentStatus={payment_status}
                btnClass={btnClass}
                onDelete={handleDelete} // 👈 pass it here
              />
            );
          }
        )
      )}
    </div>
  );
}

export default Admin;
