import { useNavigate } from "react-router-dom";
import AddCoach from "../components/Addcoach/AddCoach";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";

function AddCoachPage() {
  const navigate = useNavigate();

  const handleSuccess = () => navigate("/coaches");
  const handleClose = () => navigate("/coaches");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#030303] transition-colors duration-500">
      <Sidebar />
      <ThemeToggle />

      <main className="ml-20 min-h-screen flex items-center justify-center p-4 md:p-10">
        <AddCoach
          isOpen={true}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      </main>
    </div>
  );
}

export default AddCoachPage;
