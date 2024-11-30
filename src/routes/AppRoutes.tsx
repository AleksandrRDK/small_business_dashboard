import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ClientsPage from '../pages/ClientsPage';
import OrdersPage from '../pages/OrdersPage';
import StatisticPage from '../pages/StatisticPage';
import ClientDetailPage from '../pages/ClientDetailPage';
import OrderDetail from '../components/OrderDetail/OrderDetail';

const AppRoutes = () => (
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/clients/*" element={<ClientsPage />} />
      <Route path="/orders/*" element={<OrdersPage />} />
      <Route path="/statistic/*" element={<StatisticPage />} />
      <Route path="/client/:id" element={<ClientDetailPage />} />
      <Route path="/order/:id" element={<OrderDetail />} />
    </Routes>
  </Router>
);

export default AppRoutes;
