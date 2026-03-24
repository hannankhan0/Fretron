import UserDashboardShell from "./UserDashboardShell";
import { activeBookings } from "../../data/dashboardData";

export default function ActiveBookingsPage() {
  return (
    <UserDashboardShell
      title="Active bookings"
      subtitle="Track all current cargo arrangements from requested state through delivery completion."
    >
      <section className="grid gap-5 lg:grid-cols-3">
        {activeBookings.map((booking) => (
          <article key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-500">{booking.id}</span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{booking.status}</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{booking.shipment}</h2>
            <p className="mt-2 text-sm text-slate-600">{booking.route}</p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <div><span className="font-semibold text-slate-900">Driver / Provider:</span> {booking.provider}</div>
              <div className="mt-2"><span className="font-semibold text-slate-900">Latest update:</span> {booking.updatedAt}</div>
            </div>
            <div className="mt-5 flex gap-3">
              <button className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">Track Status</button>
              <button className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Contact Driver</button>
            </div>
          </article>
        ))}
      </section>
    </UserDashboardShell>
  );
}
