import DriverDashboardShell from "./DriverDashboardShell";
import { shipmentOpportunities } from "../../data/dashboardData";

export default function BrowseShipmentRequestsPage() {
  return (
    <DriverDashboardShell
      title="Browse shipment requests"
      subtitle="Search live demand posted by users and attach suitable cargo to your active or upcoming routes."
    >
      <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Filter requests</h2>
          <div className="mt-5 grid gap-4">
            {['Pickup city', 'Destination city', 'Preferred date', 'Shipment size / weight', 'Urgency', 'Budget'].map((label) => (
              <label key={label} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
                <input className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder={`Filter by ${label.toLowerCase()}`} />
              </label>
            ))}
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">Apply filters</button>
          </div>
        </aside>

        <div className="space-y-5">
          {shipmentOpportunities.map((item) => (
            <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{item.shipper}</h2>
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">{item.urgency}</span>
                  </div>
                  <p className="mt-3 text-lg text-slate-700">{item.route}</p>
                  <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                    <div><span className="font-semibold text-slate-900">Parcel:</span><br />{item.parcel}</div>
                    <div><span className="font-semibold text-slate-900">Weight:</span><br />{item.weight}</div>
                    <div><span className="font-semibold text-slate-900">Timing:</span><br />{item.timing}</div>
                    <div><span className="font-semibold text-slate-900">Budget:</span><br />{item.budget}</div>
                  </div>
                </div>
                <div className="flex min-w-[220px] flex-col gap-3">
                  <button className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700">Accept Shipment</button>
                  <button className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">View Details</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </DriverDashboardShell>
  );
}
