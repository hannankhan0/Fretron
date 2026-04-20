import { userReviews } from "../../data/dashboardData";
import UserDashboardShell from "./UserDashboardShell";

export default function UserProfilePage() {
  return (
    <UserDashboardShell
      title="Profile and account settings"
      subtitle="Keep your business identity, billing preferences, and delivery contact information current."
    >
      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Account details</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {[
              ["Full name", "Zaman Khan"],
              ["Business / Shop", "ZK Trading Co."],
              ["Email", "zaman@zktrading.com"],
              ["Phone", "+92 300 1234567"],
              ["Address", "Johar Town, Lahore"],
              ["Preferences", "Email + SMS alerts"],
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
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Submitted reviews</h2>
          <div className="mt-5 space-y-4">
            {userReviews.map((review) => (
              <div key={review.driver} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-slate-900">{review.driver}</div>
                  <div className="text-sm font-semibold text-amber-600">★ {review.rating}</div>
                </div>
                <div className="mt-1 text-sm text-slate-500">{review.route}</div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </UserDashboardShell>
  );
}
