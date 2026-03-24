import DriverDashboardShell from "./DriverDashboardShell";
import { activeCargo } from "../../data/dashboardData";

export default function ActiveCargoPage() {
  return (
    <DriverDashboardShell
      title="Active cargo and bookings"
      subtitle="Update operational movement from accepted to delivered so all stakeholders can see reliable shipment progress."
    >
      <section className="grid gap-5 lg:grid-cols-3">
        {activeCargo.map((cargo) => (
          <article key={cargo.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-500">{cargo.id}</span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{cargo.status}</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{cargo.shipment}</h2>
            <p className="mt-2 text-sm text-slate-600">{cargo.route}</p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <div><span className="font-semibold text-slate-900">Shipper:</span> {cargo.shipper}</div>
              <div className="mt-2"><span className="font-semibold text-slate-900">Latest update:</span> {cargo.updatedAt}</div>
            </div>
            <div className="mt-5 grid gap-2">
              <button className="rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">Mark Pickup</button>
              <button className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Mark In Transit</button>
              <button className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Mark Delivered</button>
            </div>
          </article>
        ))}
      </section>
    </DriverDashboardShell>
  );
}
