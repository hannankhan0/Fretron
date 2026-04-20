import DriverDashboardShell from "./DriverDashboardShell";

export default function DriverProfilePage() {
  return (
    <DriverDashboardShell
      title="Vehicle and profile settings"
      subtitle="Maintain personal contact details, vehicle registration profile, and route preferences for better marketplace fit."
    >
      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Driver account</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {[
              ["Full name", "Adeel Khan"],
              ["Phone", "+92 300 5556677"],
              ["Email", "adeel@fretron-driver.com"],
              ["Vehicle type", "Mazda Truck"],
              ["Vehicle number", "LEA-2026"],
              ["Route preferences", "Karachi, Lahore, Islamabad"],
            ].map(([label, value]) => (
              <label key={label} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
                <input defaultValue={value} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700">Save Changes</button>
            <button className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Change Password</button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Verification status</h2>
          <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
            Driver account approved. Documents and vehicle registration are verified by Fretron admin.
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">Driving license: Verified until 18 Dec 2026</div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">Vehicle papers: Active and approved</div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">Preferred cargo types: General goods, sealed cartons, fragile medium-value loads</div>
          </div>
        </div>
      </section>
    </DriverDashboardShell>
  );
}
