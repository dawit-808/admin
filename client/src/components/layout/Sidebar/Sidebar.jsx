import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import classes from "./Sidebar.module.css";

const iconStyle = { color: "#72839e", fontSize: "20px" };

function Sidebar() {
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
            <Tooltip title="Training Types" placement="right">
              <Link to="/training-types">
                <DirectionsRunIcon className={classes.icon} />
              </Link>
            </Tooltip>
          </li>
          <li>
            <Tooltip title="Statistics" placement="right">
              <Link to="/statistics">
                <BarChartIcon className={classes.icon} />
              </Link>
            </Tooltip>
          </li>
        </ul>
      </div>

      <div className={classes.logoutSection}>
        <Tooltip title="Logout" placement="right">
          <button className={classes.logoutBtn}>
            <LogoutIcon className={classes.icon} />
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}

export default Sidebar;
