import DriverDashboardShell from "./DriverDashboardShell";
import { driverReviews } from "../../data/dashboardData";

export default function DriverReviewsPage() {
  return (
    <DriverDashboardShell
      title="Reviews and ratings"
      subtitle="See customer trust signals, recent feedback, and service quality trends across your transport operations."
    >
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Rating summary</h2>
          <div className="mt-6 rounded-3xl bg-slate-950 p-6 text-white">
            <div className="text-5xl font-semibold tracking-tight">4.9</div>
            <div className="mt-2 text-sm text-slate-300">Average marketplace rating</div>
            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-slate-400">Completed loads</div>
                <div className="mt-2 text-2xl font-semibold">33</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-slate-400">On-time ratio</div>
                <div className="mt-2 text-2xl font-semibold">96%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Latest customer feedback</h2>
          <div className="mt-5 space-y-4">
            {driverReviews.map((review) => (
              <div key={review.customer} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-slate-900">{review.customer}</div>
                  <div className="text-sm font-semibold text-amber-600">★ {review.rating}</div>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{review.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DriverDashboardShell>
  );
}
