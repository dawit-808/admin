import Sidebar from "./Sidebar/Sidebar";
// import Footer from "./Footer/Header";

function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />
      {/* <Footer /> */}
      <main>{children}</main>
    </div>
  );
}

export default DashboardLayout;
