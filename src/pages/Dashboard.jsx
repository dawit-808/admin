import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MembersTable from "../components/MembersTable";

function Dashboard() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <div className="pl-16 pt-16">
        <main className=" min-h-[calc(100vh-64px)] flex flex-col justify-between">
          <MembersTable />
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
