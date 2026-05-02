import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import DriverSignup from "./pages/DriverSignup";
import TransporterLogin from "./pages/TransporterLogin";
import TransporterSignup from "./pages/TransporterSignup";

import UserDashboardHome from "./pages/user-dashboard/UserDashboardHome";
import PostShipmentPage from "./pages/user-dashboard/PostShipmentPage";
import MyShipmentPostsPage from "./pages/user-dashboard/MyShipmentPostsPage";
import BrowseDriversPage from "./pages/user-dashboard/BrowseDriversPage";
import ActiveBookingsPage from "./pages/user-dashboard/ActiveBookingsPage";
import BookingHistoryPage from "./pages/user-dashboard/BookingHistoryPage";
import UserNotificationsPage from "./pages/user-dashboard/UserNotificationsPage";
import UserProfilePage from "./pages/user-dashboard/UserProfilePage";

import DriverDashboardHome from "./pages/driver-dashboard/DriverDashboardHome";
import PostRoutePage from "./pages/driver-dashboard/PostRoutePage";
import MyRoutePostsPage from "./pages/driver-dashboard/MyRoutePostsPage";
import BrowseShipmentRequestsPage from "./pages/driver-dashboard/BrowseShipmentRequestsPage";
import ActiveCargoPage from "./pages/driver-dashboard/ActiveCargoPage";
import TripHistoryPage from "./pages/driver-dashboard/TripHistoryPage";
import DriverReviewsPage from "./pages/driver-dashboard/DriverReviewsPage";
import DriverProfilePage from "./pages/driver-dashboard/DriverProfilePage";

import TransporterDashboardPending from "./pages/transporter/TransporterDashboardPending";

// admin imports
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDriverRequests from "./pages/AdminDriverRequests";
import AdminTransporterRequests from "./pages/AdminTransporterRequests";
import AdminDriverRequestDetail from "./pages/AdminDriverRequestDetail";
import AdminTransporterRequestDetail from "./pages/AdminTransporterRequestDetail";
import AdminUsers from "./pages/AdminUsers";
import AdminDrivers from "./pages/AdminDrivers";
import AdminBusinesses from "./pages/AdminBusinesses";
import ClerkTokenBridge from "./components/ClerkTokenBridge";
import ProtectedClerkRoute from "./components/ProtectedClerkRoute";
import DriverGate from "./components/DriverGate";
import DriverStatus from "./pages/DriverStatus";
import ToastContainer from "./components/Toast";
import { useToast } from "./lib/useToast";

function clerkPage(component) {
  return <ProtectedClerkRoute>{component}</ProtectedClerkRoute>;
}

function driverPage(component) {
  return clerkPage(<DriverGate>{component}</DriverGate>);
}

export default function App() {
  const { toasts, dismiss } = useToast();

  return (
    <BrowserRouter>
      <ClerkTokenBridge />
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
     
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignup />} />

        <Route path="/driver-login" element={<UserLogin />} />
        <Route path="/driver-signup" element={clerkPage(<DriverSignup />)} />
        <Route path="/driver-status" element={clerkPage(<DriverStatus />)} />

        <Route path="/transporter-login" element={<TransporterLogin />} />
        <Route path="/transporter-signup" element={<TransporterSignup />} />

        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        <Route path="/user-dashboard" element={clerkPage(<UserDashboardHome />)} />
        <Route path="/user-dashboard/post-shipment" element={clerkPage(<PostShipmentPage />)} />
        <Route path="/user-dashboard/shipment-posts" element={clerkPage(<MyShipmentPostsPage />)} />
        <Route path="/user-dashboard/browse-routes" element={clerkPage(<BrowseDriversPage />)} />
        <Route path="/user-dashboard/active-bookings" element={clerkPage(<ActiveBookingsPage />)} />
        <Route path="/user-dashboard/history" element={clerkPage(<BookingHistoryPage />)} />
        <Route path="/user-dashboard/notifications" element={clerkPage(<UserNotificationsPage />)} />
        <Route path="/user-dashboard/profile" element={clerkPage(<UserProfilePage />)} />

        <Route path="/driver-dashboard" element={driverPage(<DriverDashboardHome />)} />
        <Route path="/driver-dashboard/post-route" element={driverPage(<PostRoutePage />)} />
        <Route path="/driver-dashboard/route-posts" element={driverPage(<MyRoutePostsPage />)} />
        <Route path="/driver-dashboard/browse-shipments" element={driverPage(<BrowseShipmentRequestsPage />)} />
        <Route path="/driver-dashboard/active-cargo" element={driverPage(<ActiveCargoPage />)} />
        <Route path="/driver-dashboard/history" element={driverPage(<TripHistoryPage />)} />
        <Route path="/driver-dashboard/reviews" element={driverPage(<DriverReviewsPage />)} />
        <Route path="/driver-dashboard/profile" element={driverPage(<DriverProfilePage />)} />

        <Route path="/transporter-dashboard" element={<TransporterDashboardPending />} />

        {/* admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/requests/drivers" element={<AdminDriverRequests />} />
        <Route path="/admin/requests/drivers/:id" element={<AdminDriverRequestDetail />} />
        <Route path="/admin/requests/transporters" element={<AdminTransporterRequests />} />
        <Route path="/admin/requests/transporters/:id" element={<AdminTransporterRequestDetail />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/drivers" element={<AdminDrivers />} />
        <Route path="/admin/businesses" element={<AdminBusinesses />} />
      </Routes>
    </BrowserRouter>
  );
}
