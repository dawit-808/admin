import React from "react";
import classes from "./TableHeader.module.css";

const TableHeader = () => {
  return (
    <>
      <div className={classes.table_header}>
        <div>#</div>
        <div>id</div>
        <div>Name</div>
        <div>training type</div>
        <div>training day</div>
        <div>training schedule</div>
        <div>Payment</div>
        <div>Actions</div>
      </div>
    </>
  );
};

export default TableHeader;
