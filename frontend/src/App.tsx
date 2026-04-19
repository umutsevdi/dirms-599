import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./features/auth/contexts/AuthContext";
import { DataProvider } from "./features/disasters/contexts/DataContext";
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import DashboardLayout from "./features/layout/components/DashboardLayout";
import Login from "./features/auth/pages/Login";
import MagicLinkHandler from "./features/auth/pages/MagicLinkHandler";
import OrganizationSettings from "./features/organization/pages/OrganizationSettings";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/verify" element={<MagicLinkHandler />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            />

            {/* Organization Settings - merged profile + employee management */}
            <Route
              path="/organization"
              element={
                <ProtectedRoute>
                  <OrganizationSettings />
                </ProtectedRoute>
              }
            />

            {/* Redirect old routes to new merged page */}
            <Route
              path="/entity/profile"
              element={<Navigate to="/organization" replace />}
            />
            <Route
              path="/admin/employees"
              element={<Navigate to="/organization" replace />}
            />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
