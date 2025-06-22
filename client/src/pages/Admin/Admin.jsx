import React from "react";
import classes from "./Admin.module.css";
import TableHeader from "../../components/ColumnName/TableHeader";
import UserList from "../../components/UserList/UserList";
import users from "../../assets/data";

function Admin() {
  return (
    <>
      <div className={`container gx-0 ${classes.user_container}`}>
        <TableHeader />
        {users.map(
          (
            {
              id,
              name,
              trainingType,
              trainingDay,
              trainingSchedule,
              paymentStatus,
            },
            i
          ) => {
            const btnClass =
              paymentStatus === "Paid" ? classes.green : classes.red;
            return (
              <UserList
                key={id}
                order={i + 1}
                id={id}
                name={name}
                trainingType={trainingType}
                trainingDay={trainingDay}
                trainingSchedule={trainingSchedule}
                paymentStatus={paymentStatus}
                btnClass={btnClass}
              />
            );
          }
        )}
      </div>
    </>
  );
}

export default Admin;
