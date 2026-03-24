import UserDashboardShell from "./UserDashboardShell";
import { availableRoutes } from "../../data/dashboardData";

export default function BrowseDriversPage() {
  return (
    <UserDashboardShell
      title="Browse drivers and book cargo"
      subtitle="Search the live transport supply side of Fretron using city, timing, capacity, vehicle, and commercial fit."
    >
      <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Filter routes</h2>
          <div className="mt-5 grid gap-4">
            {['Origin city', 'Destination city', 'Departure date', 'Arrival date', 'Available capacity', 'Vehicle type', 'Price range', 'Minimum rating'].map((label) => (
              <label key={label} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
                <input className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder={`Filter by ${label.toLowerCase()}`} />
              </label>
            ))}
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800">Apply filters</button>
          </div>
        </aside>

        <div className="space-y-5">
          {availableRoutes.map((route) => (
            <article key={route.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{route.provider}</h2>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">★ {route.rating}</span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{route.vehicle}</span>
                  </div>
                  <p className="mt-3 text-lg text-slate-700">{route.route}</p>
                  <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                    <div><span className="font-semibold text-slate-900">Departure:</span><br />{route.departure}</div>
                    <div><span className="font-semibold text-slate-900">Arrival:</span><br />{route.arrival}</div>
                    <div><span className="font-semibold text-slate-900">Capacity:</span><br />{route.capacity}</div>
                    <div><span className="font-semibold text-slate-900">Pricing:</span><br />{route.price}</div>
                  </div>
                  <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">{route.notes}</p>
                </div>
                <div className="flex min-w-[220px] flex-col gap-3">
                  <button className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700">Book Cargo</button>
                  <button className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">View Details</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </UserDashboardShell>
  );
}
