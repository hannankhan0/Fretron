import DriverDashboardShell from "./DriverDashboardShell";
import { tripHistory } from "../../data/dashboardData";

export default function TripHistoryPage() {
  return (
    <DriverDashboardShell
      title="Trip history"
      subtitle="Review completed trips, cancelled routes, and historical earnings potential for operational planning."
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Trip archive</h2>
            <p className="mt-1 text-sm text-slate-500">Useful for route performance review and future pricing decisions.</p>
          </div>
          <input placeholder="Search trip history" className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
        </div>
        <div className="mt-6 grid gap-4">
          {tripHistory.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-medium text-slate-900">{item.id}</div>
                <div className="mt-1 text-sm text-slate-600">{item.route}</div>
              </div>
              <div className="text-sm text-slate-600">{item.date}</div>
              <div className="text-sm font-medium text-slate-900">{item.earnings}</div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{item.result}</span>
                <button className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DriverDashboardShell>
  );
}
