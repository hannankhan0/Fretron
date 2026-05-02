import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DriverDashboardShell from "./DriverDashboardShell";
import { apiRequest } from "../../lib/api";

export default function DriverDashboardHome() {
  const [data, setData] = useState({
    stats: {
      routePosts: 0,
      activeCargo: 0,
      completedTrips: 0,
      unreadNotifications: 0,
    },
    recentRoutes: [],
    recentBookings: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("/dashboard/driver");
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      }
    })();
  }, []);

  const actions = (
    <>
      <Link to="/driver-dashboard/post-route" className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">Post Route</Link>
      <Link to="/driver-dashboard/browse-shipments" className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">Browse Shipments</Link>
    </>
  );

  return (
    <DriverDashboardShell
      title="Driver operations overview"
      subtitle="Manage route posts, cargo requests, and delivery status movement."
      actions={actions}
    >
      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Route Posts", data.stats.routePosts],
          ["Active Cargo", data.stats.activeCargo],
          ["Completed Trips", data.stats.completedTrips],
          ["Unread Notifications", data.stats.unreadNotifications],
        ].map(([label, value]) => (
          <article key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-slate-500">{label}</div>
            <div className="mt-3 text-3xl font-semibold text-slate-950">{value}</div>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Recent route posts</h2>
          <div className="mt-4 space-y-3">
            {data.recentRoutes.length === 0 ? (
              <p className="text-sm text-slate-500">No route posts yet.</p>
            ) : (
              data.recentRoutes.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="font-medium text-slate-900">{item.route_code}</div>
                  <div className="mt-1 text-sm text-slate-600">{item.origin_city} → {item.destination_city}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.status}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Recent cargo bookings</h2>
          <div className="mt-4 space-y-3">
            {data.recentBookings.length === 0 ? (
              <p className="text-sm text-slate-500">No bookings yet.</p>
            ) : (
              data.recentBookings.map((item, index) => (
                <div key={`${item.booking_code}-${index}`} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="font-medium text-slate-900">{item.booking_code}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.booking_status}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </DriverDashboardShell>
  );
}