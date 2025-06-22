import React from "react";
import classes from "./UserList.module.css";

const UserList = (props) => {
  const {
    order,
    id,
    name,
    trainingType,
    trainingDay,
    trainingSchedule,
    paymentStatus,
    btnClass,
  } = props;
  return (
    <>
      <div className={classes.user_row}>
        <div>{order}</div>
        <div>{id}</div>
        <div>{name}</div>
        <div>{trainingType}</div>
        <div>{trainingDay}</div>
        <div>{trainingSchedule}</div>
        <div>
          <span className={`${classes.payment} ${btnClass}`}>
            {paymentStatus}
          </span>
        </div>
        <div className={classes.action_icons}>
          <i className="bi-pencil-square" title="Edit"></i>
          <i className="bi-trash" title="Delete"></i>
        </div>
      </div>
    </>
  );
};

export default UserList;
