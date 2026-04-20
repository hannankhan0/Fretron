import FretronDashboardLayout from "../../components/dashboard/FretronDashboardLayout";

const driverNav = [
  { to: "/driver-dashboard", label: "Overview", end: true },
  { to: "/driver-dashboard/post-route", label: "Post Route" },
  { to: "/driver-dashboard/route-posts", label: "My Route Posts" },
  { to: "/driver-dashboard/browse-shipments", label: "Browse Shipments" },
  { to: "/driver-dashboard/active-cargo", label: "Active Cargo" },
  { to: "/driver-dashboard/history", label: "Trip History" },
  { to: "/driver-dashboard/reviews", label: "Reviews" },
  { to: "/driver-dashboard/profile", label: "Vehicle & Profile" },
];

export default function DriverDashboardShell({ title, subtitle, children, actions }) {
  return (
    <FretronDashboardLayout
      title={title}
      subtitle={subtitle}
      badge="Driver Dashboard"
      navItems={driverNav}
      actions={actions}
    >
      {children}
    </FretronDashboardLayout>
  );
}