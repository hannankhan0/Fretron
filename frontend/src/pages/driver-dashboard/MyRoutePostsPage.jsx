import { useEffect, useState } from "react";
import DriverDashboardShell from "./DriverDashboardShell";
import { apiRequest } from "../../lib/api";
import { useClerkApi } from "../../lib/useClerkApi";

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

export default function MyRoutePostsPage() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiReady = useClerkApi();

  async function loadRoutes() {
    try {
      setLoading(true);
      const res = await apiRequest("/routes/my", {
        headers: { "X-Fretron-Mode": "driver" },
      });
      setRoutes(res.routes || []);
    } catch (err) {
      setError(err.message || "Failed to load routes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (!apiReady) return; loadRoutes(); }, [apiReady]);

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
      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}

      <section className="glass rounded-3xl p-6 shadow-sm">
        {loading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {["Code","Route","Departure","Capacity","Status","Actions"].map(h => (
                    <th key={h} className="pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <SkeletonRow /><SkeletonRow /><SkeletonRow />
              </tbody>
            </table>
          </div>
        ) : routes.length === 0 ? (
          <div className="py-8 text-center">
            <div className="animate-fade-in-scale mx-auto mb-3 text-4xl">🗺️</div>
            <p className="text-slate-500 dark:text-slate-400">No route posts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Code</th>
                  <th className="pb-3 pr-4 font-medium">Route</th>
                  <th className="pb-3 pr-4 font-medium">Departure</th>
                  <th className="pb-3 pr-4 font-medium">Capacity</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr
                    key={route.id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/40"
                  >
                    <td className="py-4 pr-4 font-mono text-xs text-slate-700 dark:text-slate-300">{route.route_code}</td>
                    <td className="py-4 pr-4 text-slate-800 dark:text-slate-200">{route.origin_city} → {route.destination_city}</td>
                    <td className="py-4 pr-4 text-slate-600 dark:text-slate-400">{new Date(route.departure_datetime).toLocaleString()}</td>
                    <td className="py-4 pr-4 text-slate-600 dark:text-slate-400">{route.available_capacity_kg} kg</td>
                    <td className="py-4 pr-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                        {route.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => handleDelete(route.id)}
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
    </DriverDashboardShell>
  );
}
