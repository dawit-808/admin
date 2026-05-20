import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
  const { accessToken, role, authReady } = useContext(AuthContext);
  const location = useLocation();

  // If AuthProvider is still doing its initial refresh, stay silent.
  // The global AuthLoader in App.jsx is already covering the screen.
  if (!authReady) return null;

  // 1. Force Login if no token exists
  if (!accessToken) {
    // We pass the current path to 'state' so we can redirect them back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role Security Check
  // If the user's role isn't in the allowed list, bounce them.
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Success
  // Use <Outlet /> so you can wrap multiple routes in App.jsx without junky prop drilling
  return <Outlet />;
};

export default RoleRoute;
