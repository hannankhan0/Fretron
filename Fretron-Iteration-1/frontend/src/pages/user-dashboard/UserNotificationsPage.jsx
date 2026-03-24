import UserDashboardShell from "./UserDashboardShell";
import { userNotifications } from "../../data/dashboardData";

export default function UserNotificationsPage() {
  return (
    <UserDashboardShell
      title="Notifications and alerts"
      subtitle="Stay updated about live booking movement, route matches, and platform notices that affect your shipments."
    >
      <section className="space-y-4">
        {userNotifications.map((notification) => (
          <article key={notification.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <div className="flex items-center justify-between gap-4">
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{notification.type}</div>
              <div className="text-sm text-slate-500">{notification.time}</div>
            </div>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">{notification.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{notification.body}</p>
          </article>
        ))}
      </section>
    </UserDashboardShell>
  );
}
