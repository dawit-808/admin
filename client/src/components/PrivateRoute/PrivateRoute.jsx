import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}
export default PrivateRoute;
