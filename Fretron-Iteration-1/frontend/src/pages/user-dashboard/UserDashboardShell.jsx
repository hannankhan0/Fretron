import FretronDashboardLayout from "../../components/dashboard/FretronDashboardLayout";

const userNav = [
  { to: "/user-dashboard", label: "Overview", end: true },
  { to: "/user-dashboard/post-shipment", label: "Post Shipment" },
  { to: "/user-dashboard/shipment-posts", label: "My Shipment Posts", count: 8 },
  { to: "/user-dashboard/browse-routes", label: "Browse Drivers" },
  { to: "/user-dashboard/active-bookings", label: "Active Bookings", count: 12 },
  { to: "/user-dashboard/history", label: "Booking History" },
  { to: "/user-dashboard/notifications", label: "Notifications", count: 5 },
  { to: "/user-dashboard/profile", label: "Profile & Settings" },
];

export default function UserDashboardShell({ title, subtitle, children, actions }) {
  return (
    <FretronDashboardLayout
      title={title}
      subtitle={subtitle}
      badge="User Dashboard"
      navItems={userNav}
      actions={actions}
    >
      {children}
    </FretronDashboardLayout>
  );
}
