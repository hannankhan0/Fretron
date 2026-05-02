import { useEffect, useState } from "react";
import UserDashboardShell from "./UserDashboardShell";
import { apiRequest } from "../../lib/api";

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

  useEffect(() => {
    loadShipments();
  }, []);

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
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : shipments.length === 0 ? (
          <div className="text-slate-500">No shipment posts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-medium">Code</th>
                  <th className="pb-3 font-medium">Route</th>
                  <th className="pb-3 font-medium">Weight</th>
                  <th className="pb-3 font-medium">Pickup</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-4">{item.shipment_code}</td>
                    <td className="py-4">{item.pickup_city} → {item.destination_city}</td>
                    <td className="py-4">{item.weight_kg} kg</td>
                    <td className="py-4">{new Date(item.pickup_date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button onClick={() => handleDelete(item.id)} className="rounded-xl border border-red-300 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50">
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