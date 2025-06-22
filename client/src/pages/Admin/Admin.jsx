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
                id={id} // can still be used internally for delete/edit
                memberCode={member_code} // display this in table
                name={name}
                trainingType={training_type}
                trainingDay={training_day}
                trainingSchedule={training_schedule}
                paymentStatus={payment_status}
                btnClass={btnClass}
              />
            );
          }
        )
      )}
    </div>
  );
}

export default Admin;
