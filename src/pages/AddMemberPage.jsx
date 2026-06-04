import { useNavigate } from "react-router-dom";
import AddMembers from "../components/Addmembers/AddMembers";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

function AddMemberPage() {
  const navigate = useNavigate();

  // Since this is a dedicated page, we force the internal
  // AddMembers component to be "open" and visible immediately.
  const handleSuccess = () => {
    // After successful registration, redirect back to the main list
    navigate("/members");
  };

  const handleClose = () => {
    // If they click 'Cancel' or 'Close', take them back
    navigate("/members");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] transition-colors duration-500">
      <Sidebar />
      <ThemeToggle />

      {/* We use 'ml-20' to clear your Sidebar. 
          The AddMembers component is rendered directly here.
      */}
      <main className="ml-20 min-h-screen flex items-center justify-center p-4 md:p-10">
        <AddMembers
          isOpen={true}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </main>
    </div>
  );
}

export default AddMemberPage;
