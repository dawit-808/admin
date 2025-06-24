import classes from "./DashboardLayout.module.css";
import Sidebar from "./Sidebar/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className={classes.wrapper}>
      <Sidebar />
      <main className={classes.main}>{children}</main>
    </div>
  );
}

export default DashboardLayout;
