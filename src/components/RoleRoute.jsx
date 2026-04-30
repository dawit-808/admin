import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RoleRoute = ({ children, allowedRoles }) => {
  const { accessToken, role, loading, authReady } = useContext(AuthContext);

  // 🔥 wait until refresh finishes
  if (loading || !authReady) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
          <div className="h-10 w-10 bg-blue-600/20 rounded-full animate-pulse"></div>
        </div>
        <p className="mt-6 text-sm font-medium text-gray-400 tracking-widest uppercase animate-pulse">
          Authenticating
        </p>
      </div>
    );
  }

  // 🔴 not logged in
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // 🔴 role not ready yet (extra safety)
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading role...
      </div>
    );
  }

  // 🔴 unauthorized role
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  // ✅ allowed
  return children;
};

export default RoleRoute;
