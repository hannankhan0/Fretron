import { Link } from "react-router-dom";
import UserDashboardShell from "./UserDashboardShell";
import { userOverviewStats, userRecentActivity, availableRoutes, activeBookings } from "../../data/dashboardData";

export default function UserDashboardHome() {
  const actions = (
    <>
      <Link to="/user-dashboard/post-shipment" className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Post Shipment</Link>
      <Link to="/user-dashboard/browse-routes" className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Browse Routes</Link>
    </>
  );

  return (
    <UserDashboardShell
      title="User operations overview"
      subtitle="Manage shipment demand, monitor booking progress, and discover suitable transport capacity from the marketplace."
      actions={actions}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {userOverviewStats.map((item) => (
          <article key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/70">
            <div className="text-sm font-medium text-slate-500">{item.label}</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</div>
            <div className="mt-2 text-sm text-emerald-600">{item.change}</div>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Recent activity</h2>
              <p className="mt-1 text-sm text-slate-500">Latest movement across your shipment posts and driver bookings.</p>
            </div>
            <Link to="/user-dashboard/notifications" className="text-sm font-medium text-blue-600 hover:text-blue-700">Open alerts</Link>
          </div>

          <div className="mt-5 space-y-4">
            {userRecentActivity.map((item) => (
              <div key={item.title} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                <div>
                  <div className="font-medium text-slate-900">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-500">{item.time}</div>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Quick actions</h2>
            <div className="mt-5 grid gap-3">
              <Link to="/user-dashboard/post-shipment" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">Create a new shipment request</Link>
              <Link to="/user-dashboard/browse-routes" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Compare live driver routes</Link>
              <Link to="/user-dashboard/active-bookings" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Track active bookings</Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Top route matches today</h2>
            <div className="mt-4 space-y-4">
              {availableRoutes.slice(0, 2).map((route) => (
                <div key={route.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-slate-900">{route.provider}</div>
                    <span className="text-sm font-semibold text-amber-600">★ {route.rating}</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{route.route}</div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                    <span>{route.capacity}</span>
                    <span>{route.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Live booking pipeline</h2>
            <p className="mt-1 text-sm text-slate-500">Monitor current cargo movement without leaving the user portal.</p>
          </div>
          <Link to="/user-dashboard/active-bookings" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</Link>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {activeBookings.map((booking) => (
            <div key={booking.id} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-slate-500">{booking.id}</div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{booking.status}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-950">{booking.shipment}</h3>
              <p className="mt-1 text-sm text-slate-600">{booking.route}</p>
              <p className="mt-4 text-sm text-slate-500">Provider: {booking.provider}</p>
              <p className="mt-1 text-sm text-slate-500">{booking.updatedAt}</p>
            </div>
          ))}
        </div>
      </section>
    </UserDashboardShell>
  );
}
