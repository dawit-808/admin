import { useNavigate } from "react-router-dom";
import classes from "./UserList.module.css";
import DeleteIcon from "@mui/icons-material/Delete";

const UserList = (props) => {
  const navigate = useNavigate();
  const {
    id,
    memberCode,
    name,
    trainingType,
    trainingDay,
    trainingSchedule,
    paymentStatus,
    btnClass,
    order,
    onDelete, // 👈 receive delete function
  } = props;

  return (
    <div className={classes.user_row}>
      <div>{order}</div>
      <div
        className={classes.clickable_code}
        onClick={() => navigate(`/member/${id}`)}
        title="View Member Details"
      >
        {memberCode}
      </div>
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
        <DeleteIcon
          title="Delete"
          onClick={() => onDelete(id)}
          style={{ cursor: "pointer", color: "crimson", marginLeft: "10px" }}
        ></DeleteIcon>
      </div>
    </div>
  );
};

export default UserList;
