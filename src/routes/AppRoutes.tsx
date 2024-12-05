
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import DashboardPage from "../pages/DashboardPage";
import ClientsPage from "../pages/ClientsPage";
import OrdersPage from "../pages/OrdersPage";
import StatisticPage from "../pages/StatisticPage";
import ClientDetailPage from "../pages/ClientDetailPage";
import OrderDetail from "../components/OrderDetail/OrderDetail";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "../context/AuthContext";

const AppRoutes = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/*"
          element={
            <ProtectedRoute>
              <ClientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/*"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistic/*"
          element={
            <ProtectedRoute>
              <StatisticPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/:id"
          element={
            <ProtectedRoute>
              <ClientDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default AppRoutes;
