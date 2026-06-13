import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import WeatherPage from '../pages/WeatherPage';
import MarketPage from '../pages/MarketPage';
import IrrigationPage from '../pages/IrrigationPage';
import CropCarePage from '../pages/CropCarePage';
import DiseasePage from '../pages/DiseasePage';
import SchemesPage from '../pages/SchemesPage';
import ChatbotPage from '../pages/ChatbotPage';
import NotificationsPage from '../pages/NotificationsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/irrigation" element={<IrrigationPage />} />
        <Route path="/crop-care" element={<CropCarePage />} />
        <Route path="/diseases" element={<DiseasePage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  );
}
