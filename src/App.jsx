import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Dashboard from "./pages/Dashboard";
import AddMember from "./pages/AddMember";
import AddCoach from "./pages/AddCoach";
import Auth from "./pages/Auth";
import RoleRoute from "./components/RoleRoute";
import Statistics from "./pages/Statistics";

function AppRoutes() {
  const { loading, authReady } = useContext(AuthContext);

  // 🔥 BLOCK APP UNTIL AUTH IS READY
  if (loading || !authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
        Loading app...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Auth />} />

      {/* Protected */}
      <Route
        path="/"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <Dashboard />
          </RoleRoute>
        }
      />

      <Route
        path="/add-member"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <AddMember />
          </RoleRoute>
        }
      />

      <Route
        path="/add-coach"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <AddCoach />
          </RoleRoute>
        }
      />

      <Route
        path="/statistics"
        element={
          <RoleRoute allowedRoles={["admin"]}>
            <Statistics />
          </RoleRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
