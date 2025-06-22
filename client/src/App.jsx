import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin/Admin";
import MemberDetails from "./pages/MemberDetails/MemberDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Admin />} />
        <Route path="/member/:id" element={<MemberDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
