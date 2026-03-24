import DriverDashboardShell from "./DriverDashboardShell";

export default function PostRoutePage() {
  return (
    <DriverDashboardShell
      title="Post route and available capacity"
      subtitle="Publish transport supply with enough detail so users can discover and book your route with confidence."
      actions={<button className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Save Draft</button>}
    >
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["Origin city", "Karachi"],
              ["Destination city", "Lahore"],
              ["Departure date & time", "24 Mar 2026 · 8:00 PM"],
              ["Estimated arrival", "25 Mar 2026 · 10:00 AM"],
              ["Available capacity", "420 kg"],
              ["Vehicle type", "Mazda Truck"],
              ["Pricing model", "Flat per booking"],
              ["Restrictions", "No hazardous goods"],
            ].map(([label, placeholder]) => (
              <label key={label} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
                <input
                  type="text"
                  placeholder={placeholder}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            ))}
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Operational notes</span>
              <textarea rows="5" placeholder="Handles sealed cargo, available for same-day pickup within city, no refrigeration..." className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700">Publish Route</button>
            <button type="button" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Save as Draft</button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Posting checklist</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• Exact origin and destination improve shipment match quality.</li>
              <li>• Available capacity should reflect real free space after current bookings.</li>
              <li>• Mention restrictions clearly to avoid bad-fit cargo requests.</li>
              <li>• Notes should explain pickup radius, loading help, and timing flexibility.</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm shadow-blue-100/80">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">What happens next?</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <p>1. Your route appears in the user marketplace search.</p>
              <p>2. Shippers can book against your capacity or you can browse matching requests yourself.</p>
              <p>3. Once bookings attach to this route, you can update pickup and transit status from active cargo.</p>
            </div>
          </div>
        </div>
      </section>
    </DriverDashboardShell>
  );
}
