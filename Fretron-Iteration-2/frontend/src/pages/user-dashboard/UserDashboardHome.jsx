import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import UserDashboardShell from "./UserDashboardShell";
import { apiRequest } from "../../lib/api";

export default function UserDashboardHome() {
  const [data, setData] = useState({
    stats: {
      shipmentPosts: 0,
      activeBookings: 0,
      completedBookings: 0,
      unreadNotifications: 0,
    },
    recentShipments: [],
    recentBookings: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("/dashboard/user");
        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      }
    })();
  }, []);

  const actions = (
    <>
      <Link to="/user-dashboard/post-shipment" className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">Post Shipment</Link>
      <Link to="/user-dashboard/browse-routes" className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">Browse Routes</Link>
    </>
  );

  return (
    <UserDashboardShell
      title="User operations overview"
      subtitle="Manage shipment posts, booking responses, and active logistics flow."
      actions={actions}
    >
      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Shipment Posts", data.stats.shipmentPosts],
          ["Active Bookings", data.stats.activeBookings],
          ["Completed Bookings", data.stats.completedBookings],
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
          <h2 className="text-xl font-semibold">Recent shipment posts</h2>
          <div className="mt-4 space-y-3">
            {data.recentShipments.length === 0 ? (
              <p className="text-sm text-slate-500">No shipment posts yet.</p>
            ) : (
              data.recentShipments.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="font-medium text-slate-900">{item.shipment_code}</div>
                  <div className="mt-1 text-sm text-slate-600">{item.pickup_city} → {item.destination_city}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.status}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Recent bookings</h2>
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
    </UserDashboardShell>
  );
}