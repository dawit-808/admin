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
      <h2 className={classes.title}>Members</h2>
      <TableHeader />
      {loading ? (
        <p>Loading users...</p>
      ) : (
        users.map((user, i) => {
          const btnClass =
            user.payment_status.toLowerCase() === "paid"
              ? classes.green
              : classes.red;

          return (
            <UserList
              key={user.id}
              order={i + 1}
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
        })
      )}
    </div>
  );
}

export default Admin;
