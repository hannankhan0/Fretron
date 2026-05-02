import FretronDashboardLayout from "../../components/dashboard/FretronDashboardLayout";
import { useNavigate } from "react-router-dom";

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

export default function DriverDashboardShell({
  title,
  subtitle,
  children,
  actions,
  mapMode = false,
}) {
  const navigate = useNavigate();

  function handleSwitchToUserMode() {
    navigate("/user-dashboard");
  }

  const mergedActions = (
    <>
      {actions}
      <button
        type="button"
        onClick={handleSwitchToUserMode}
        className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
      >
        Switch to User Mode
      </button>
    </>
  );

  return (
    <FretronDashboardLayout
      title={title}
      subtitle={subtitle}
      badge="Driver Dashboard"
      navItems={driverNav}
      actions={mergedActions}
      hideHeader={mapMode}
      contentFull={mapMode}
    >
      {children}
    </FretronDashboardLayout>
  );
}