import UserDashboardShell from "./UserDashboardShell";
import { shipmentPosts } from "../../data/dashboardData";

export default function MyShipmentPostsPage() {
  return (
    <UserDashboardShell
      title="My shipment posts"
      subtitle="Review all demand you have created, including drafts, live posts, booked shipments, and completed movement history."
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Shipment pipeline</h2>
            <p className="mt-1 text-sm text-slate-500">Search, update, or archive demand posts as your shipping needs evolve.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input placeholder="Search by shipment ID or city" className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            <select className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
              <option>All statuses</option>
              <option>Draft</option>
              <option>Published</option>
              <option>Matched</option>
              <option>Booked</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 font-medium">Shipment</th>
                <th className="pb-3 font-medium">Route</th>
                <th className="pb-3 font-medium">Timing</th>
                <th className="pb-3 font-medium">Matches</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipmentPosts.map((post) => (
                <tr key={post.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="py-4">
                    <div className="font-medium text-slate-900">{post.id}</div>
                    <div className="mt-1 text-slate-500">{post.category} · {post.weight}</div>
                  </td>
                  <td className="py-4 text-slate-600">{post.pickup} → {post.destination}</td>
                  <td className="py-4 text-slate-600">{post.timing}</td>
                  <td className="py-4 text-slate-600">{post.matches}</td>
                  <td className="py-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{post.status}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100">View</button>
                      <button className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </UserDashboardShell>
  );
}
