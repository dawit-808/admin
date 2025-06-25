import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Admin from "./pages/Admin/Admin";
import MemberDetails from "./pages/MemberDetails/MemberDetails";
import Auth from "./pages/Auth/Auth";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import RegisterMember from "./pages/RegisterMember/RegisterMember";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login (No layout) */}
        <Route path="/login" element={<Auth />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Admin />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/member/:id"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <MemberDetails />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/register-member"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <RegisterMember />
              </DashboardLayout>
            </PrivateRoute>
          }
        />

        {/* 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
