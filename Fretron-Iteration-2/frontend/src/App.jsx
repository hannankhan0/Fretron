import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import DriverLogin from "./pages/DriverLogin";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/user-signup" element={<UserSignup />} />

        <Route path="/driver-login" element={<DriverLogin />} />
        <Route path="/driver-signup" element={<DriverSignup />} />

        <Route path="/transporter-login" element={<TransporterLogin />} />
        <Route path="/transporter-signup" element={<TransporterSignup />} />

        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        <Route path="/user-dashboard" element={<UserDashboardHome />} />
        <Route path="/user-dashboard/post-shipment" element={<PostShipmentPage />} />
        <Route path="/user-dashboard/shipment-posts" element={<MyShipmentPostsPage />} />
        <Route path="/user-dashboard/browse-routes" element={<BrowseDriversPage />} />
        <Route path="/user-dashboard/active-bookings" element={<ActiveBookingsPage />} />
        <Route path="/user-dashboard/history" element={<BookingHistoryPage />} />
        <Route path="/user-dashboard/notifications" element={<UserNotificationsPage />} />
        <Route path="/user-dashboard/profile" element={<UserProfilePage />} />

        <Route path="/driver-dashboard" element={<DriverDashboardHome />} />
        <Route path="/driver-dashboard/post-route" element={<PostRoutePage />} />
        <Route path="/driver-dashboard/route-posts" element={<MyRoutePostsPage />} />
        <Route path="/driver-dashboard/browse-shipments" element={<BrowseShipmentRequestsPage />} />
        <Route path="/driver-dashboard/active-cargo" element={<ActiveCargoPage />} />
        <Route path="/driver-dashboard/history" element={<TripHistoryPage />} />
        <Route path="/driver-dashboard/reviews" element={<DriverReviewsPage />} />
        <Route path="/driver-dashboard/profile" element={<DriverProfilePage />} />

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