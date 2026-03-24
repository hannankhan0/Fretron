import { Link } from "react-router-dom";
import DriverDashboardShell from "./DriverDashboardShell";
import { driverOverviewStats, routePosts, shipmentOpportunities, activeCargo } from "../../data/dashboardData";

export default function DriverDashboardHome() {
  const actions = (
    <>
      <Link to="/driver-dashboard/post-route" className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Post Route</Link>
      <Link to="/driver-dashboard/browse-shipments" className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Browse Shipments</Link>
    </>
  );

  return (
    <DriverDashboardShell
      title="Driver operations overview"
      subtitle="Control your route supply, discover shipper demand, and monitor live delivery progress from one logistics workspace."
      actions={actions}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {driverOverviewStats.map((item) => (
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
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Live route performance</h2>
              <p className="mt-1 text-sm text-slate-500">Snapshot of your currently posted routes and how quickly capacity is filling.</p>
            </div>
            <Link to="/driver-dashboard/route-posts" className="text-sm font-medium text-blue-600 hover:text-blue-700">See all routes</Link>
          </div>
          <div className="mt-5 space-y-4">
            {routePosts.map((route) => (
              <div key={route.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-slate-900">{route.route}</div>
                    <div className="mt-1 text-sm text-slate-500">{route.departure} · {route.vehicle}</div>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{route.status}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                  <span>Open capacity: {route.capacity}</span>
                  <span>{route.bookings} booking(s)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Quick actions</h2>
            <div className="mt-5 grid gap-3">
              <Link to="/driver-dashboard/post-route" className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">Publish a route</Link>
              <Link to="/driver-dashboard/browse-shipments" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Find matching shipments</Link>
              <Link to="/driver-dashboard/active-cargo" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Open active cargo</Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Top shipment opportunities</h2>
            <div className="mt-4 space-y-4">
              {shipmentOpportunities.slice(0, 2).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-slate-900">{item.shipper}</div>
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">{item.urgency}</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{item.route}</div>
                  <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                    <span>{item.weight}</span>
                    <span>{item.budget}</span>
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
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Active cargo board</h2>
            <p className="mt-1 text-sm text-slate-500">Bookings already attached to your current trips and awaiting status updates.</p>
          </div>
          <Link to="/driver-dashboard/active-cargo" className="text-sm font-medium text-blue-600 hover:text-blue-700">Manage cargo</Link>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {activeCargo.map((cargo) => (
            <div key={cargo.id} className="rounded-2xl border border-slate-200 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-slate-500">{cargo.id}</div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{cargo.status}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-slate-950">{cargo.shipment}</h3>
              <p className="mt-1 text-sm text-slate-600">{cargo.route}</p>
              <p className="mt-4 text-sm text-slate-500">Shipper: {cargo.shipper}</p>
              <p className="mt-1 text-sm text-slate-500">{cargo.updatedAt}</p>
            </div>
          ))}
        </div>
      </section>
    </DriverDashboardShell>
  );
}
