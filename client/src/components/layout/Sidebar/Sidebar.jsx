import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import classes from "./Sidebar.module.css";
import axios from "axios";

function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    window.location.href = "/login";
  };

  return (
    <aside className={classes.sidebar}>
      <div className={classes.navSection}>
        <ul>
          <li>
            <Tooltip title="Members" placement="right">
              <Link to="/">
                <ArticleIcon className={classes.icon} />
              </Link>
            </Tooltip>
          </li>

          <li>
            <Tooltip title="Register Member" placement="right">
              <Link to="/register-member">
                <PersonAddIcon className={classes.icon} />
              </Link>
            </Tooltip>
          </li>
        </ul>
      </div>

      <div className={classes.logoutSection}>
        <Tooltip title="Logout" placement="right">
          <button onClick={handleLogout} className={classes.logoutBtn}>
            <LogoutIcon className={classes.icon} />
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}

export default Sidebar;
