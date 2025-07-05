import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddMember from "./pages/AddMember";
import AddCoach from "./pages/AddCoach";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-member" element={<AddMember />} />
        <Route path="/add-coach" element={<AddCoach />} />
      </Routes>
    </Router>
  );
}

export default App;
