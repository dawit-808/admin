import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import DashboardLayout from "./components/layout/DashboardLayout";
import Admin from "./pages/Admin/Admin";
import MemberDetails from "./pages/MemberDetails/MemberDetails";
// import TrainingTypePage from "./pages/TrainingTypePage";
// import Stats from "./pages/Statistics";

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Admin />} />{" "}
          <Route path="/member/:id" element={<MemberDetails />} />;
          {/* <Route path="/training-types" element={<TrainingTypePage />} />
          <Route path="/statistics" element={<Stats />} /> */}
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
