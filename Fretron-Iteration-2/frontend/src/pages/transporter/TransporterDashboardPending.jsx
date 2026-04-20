import { Link } from "react-router-dom";
import FretronDashboardLayout from "../../components/dashboard/FretronDashboardLayout";

const navItems = [
  { to: "/transporter-dashboard", label: "Overview", end: true },
];

export default function TransporterDashboardPending() {
  return (
    <FretronDashboardLayout
      title="Transport business dashboard"
      subtitle="Your company portal is reserved and the final operating workspace is planned for the next project iteration."
      badge="Transporter Portal"
      navItems={navItems}
      actions={<Link to="/" className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Back to platform</Link>}
    >
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/60">
        <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
          Pending build
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">Transporter dashboard will be completed in Iteration 2</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          Your transport business role and application flow can already exist in the platform, but the fleet management and business control dashboard is intentionally postponed to Iteration 2 so the current sprint can focus on complete user and driver marketplace workflows.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            "Fleet overview and company-level route inventory",
            "Business shipment opportunity management",
            "Assigned driver visibility and utilization tracking",
            "Commercial analytics and capacity reporting",
            "Multi-vehicle live operations monitoring",
            "Business profile and contract management",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </section>
    </FretronDashboardLayout>
  );
}
