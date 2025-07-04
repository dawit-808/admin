import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserTable from "../components/UserTable";

function Dashboard() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Sidebar />

      {/* Push content right and down */}
      <div className="p-16">
        <main className="p-6 min-h-[calc(100vh-64px)] flex flex-col justify-between">
          <UserTable />
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
