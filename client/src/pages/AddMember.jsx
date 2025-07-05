import Footer from "../components/Footer";
import MemberReg from "../components/MemberReg";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function AddMember() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      {/* Push content right and down */}
      <div className="pl-16 pt-16">
        <main className=" min-h-[calc(100vh-64px)] flex flex-col justify-between">
          <MemberReg />
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default AddMember;
