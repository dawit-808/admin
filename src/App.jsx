import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Components
import RoleRoute from "./components/RoleRoute";
import AuthLoader from "./components/AuthLoader";

// Pages
import Members from "./pages/Members";
import Auth from "./pages/Auth";
import Statistics from "./pages/Statistics";
import Coaches from "./pages/Coaches";
import CoachProfile from "./pages/CoachProfile";
import AddMemberPage from "./pages/AddMemberPage";
import AddCoachPage from "./pages/AddCoachPage";

function AppRoutes() {
  const { loading, authReady } = useContext(AuthContext);

  if (loading || !authReady) return <AuthLoader />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Auth />} />

      {/* Admin Restricted Workspace */}
      <Route element={<RoleRoute allowedRoles={["admin"]} />}>
        {/* All routes inside this block inherit the admin requirement */}
        <Route path="/" element={<Statistics />} />
        <Route path="/members" element={<Members />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/add-member" element={<AddMemberPage />} />
        <Route path="/add-coach" element={<AddCoachPage />} />
      </Route>

      {/* Hybrid/Shared Routes */}
      <Route path="/coaches/:id" element={<CoachProfile />} />

      {/* Catch-all: Redirect unknown to Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
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
