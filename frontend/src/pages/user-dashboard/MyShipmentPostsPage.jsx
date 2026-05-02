import { useEffect, useState } from "react";
import UserDashboardShell from "./UserDashboardShell";
import { apiRequest } from "../../lib/api";

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700">
      {[1,2,3,4,5,6].map(i => (
        <td key={i} className="py-4 pr-4">
          <div className="skeleton h-5 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export default function MyShipmentPostsPage() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadShipments() {
    try {
      setLoading(true);
      const res = await apiRequest("/shipments/my");
      setShipments(res.shipments || []);
    } catch (err) {
      setError(err.message || "Failed to load shipments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadShipments(); }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this shipment post?")) return;
    try {
      await apiRequest(`/shipments/${id}`, { method: "DELETE" });
      loadShipments();
    } catch (err) {
      alert(err.message || "Failed to delete shipment");
    }
  }

  return (
    <UserDashboardShell
      title="My shipment posts"
      subtitle="See every shipment request you created and manage its lifecycle."
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
        {error && (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {["Code","Route","Weight","Pickup","Status","Actions"].map(h => (
                    <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <SkeletonRow /><SkeletonRow /><SkeletonRow />
              </tbody>
            </table>
          </div>
        ) : shipments.length === 0 ? (
          <div className="py-8 text-center">
            <div className="animate-float mx-auto mb-3 text-4xl">📦</div>
            <p className="text-slate-500 dark:text-slate-400">No shipment posts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Code</th>
                  <th className="pb-3 pr-4 font-medium">Route</th>
                  <th className="pb-3 pr-4 font-medium">Weight</th>
                  <th className="pb-3 pr-4 font-medium">Pickup</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/40"
                  >
                    <td className="py-4 pr-4 font-mono text-xs text-slate-700 dark:text-slate-300">{item.shipment_code}</td>
                    <td className="py-4 pr-4 text-slate-800 dark:text-slate-200">{item.pickup_city} → {item.destination_city}</td>
                    <td className="py-4 pr-4 text-slate-600 dark:text-slate-400">{item.weight_kg} kg</td>
                    <td className="py-4 pr-4 text-slate-600 dark:text-slate-400">{new Date(item.pickup_date).toLocaleDateString()}</td>
                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="fretron-btn rounded-xl border border-red-300 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </UserDashboardShell>
  );
}
