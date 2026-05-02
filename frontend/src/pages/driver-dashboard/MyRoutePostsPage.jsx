import { useEffect, useState } from "react";
import DriverDashboardShell from "./DriverDashboardShell";
import { apiRequest } from "../../lib/api";

export default function MyRoutePostsPage() {
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState("");

  async function loadRoutes() {
    try {
      const res = await apiRequest("/routes/my");
      setRoutes(res.routes || []);
    } catch (err) {
      setError(err.message || "Failed to load routes");
    }
  }

  useEffect(() => {
    loadRoutes();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this route post?")) return;
    try {
      await apiRequest(`/routes/${id}`, { method: "DELETE" });
      loadRoutes();
    } catch (err) {
      alert(err.message || "Failed to delete route");
    }
  }

  return (
    <DriverDashboardShell
      title="My route posts"
      subtitle="See and manage all route posts you published."
    >
      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {routes.length === 0 ? (
          <div className="text-slate-500">No route posts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 font-medium">Code</th>
                  <th className="pb-3 font-medium">Route</th>
                  <th className="pb-3 font-medium">Departure</th>
                  <th className="pb-3 font-medium">Capacity</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.id} className="border-b border-slate-100">
                    <td className="py-4">{route.route_code}</td>
                    <td className="py-4">{route.origin_city} → {route.destination_city}</td>
                    <td className="py-4">{new Date(route.departure_datetime).toLocaleString()}</td>
                    <td className="py-4">{route.available_capacity_kg} kg</td>
                    <td className="py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {route.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button onClick={() => handleDelete(route.id)} className="rounded-xl border border-red-300 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50">
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
    </DriverDashboardShell>
  );
}