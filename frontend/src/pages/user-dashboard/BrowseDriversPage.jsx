import { useEffect, useState } from "react";
import UserDashboardShell from "./UserDashboardShell";
import { apiRequest } from "../../lib/api";
import { useClerkApi } from "../../lib/useClerkApi";

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl flex-1 space-y-3">
          <div className="skeleton h-7 w-48" />
          <div className="skeleton h-5 w-64" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-12" />)}
          </div>
          <div className="skeleton h-14 w-full" />
        </div>
        <div className="flex min-w-[280px] flex-col gap-3">
          <div className="skeleton h-12 w-full" />
          <div className="skeleton h-12 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function BrowseDriversPage() {
  const [routes, setRoutes] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [selectedShipmentByRoute, setSelectedShipmentByRoute] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiReady = useClerkApi();

  async function loadData() {
    try {
      setLoading(true);
      const [routesRes, shipmentsRes] = await Promise.all([
        apiRequest("/routes"),
        apiRequest("/shipments/my?status=published"),
      ]);
      setRoutes(routesRes.routes || []);
      setShipments(shipmentsRes.shipments || []);
    } catch (err) {
      setError(err.message || "Failed to load marketplace routes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (!apiReady) return; loadData(); }, [apiReady]);

  async function handleRequest(routeId) {
    const shipmentId = selectedShipmentByRoute[routeId];
    if (!shipmentId) {
      alert("Please select one of your shipment posts first.");
      return;
    }
    try {
      await apiRequest("/bookings", {
        method: "POST",
        body: JSON.stringify({ shipmentPostId: shipmentId, routePostId: routeId }),
      });
      alert("Booking request sent successfully.");
      loadData();
    } catch (err) {
      alert(err.message || "Failed to send booking request");
    }
  }

  return (
    <UserDashboardShell
      title="Browse drivers and routes"
      subtitle="Choose a live driver route and attach one of your shipment posts to it."
    >
      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && shipments.length === 0 && (
        <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          You need at least one published shipment post before requesting a driver route.
        </div>
      )}

      <section className="space-y-5">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : routes.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
            <div className="animate-float mx-auto mb-4 text-5xl">🚚</div>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400">
              No driver routes available right now.
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Drivers post routes daily — check back soon.
            </p>
          </div>
        ) : (
          routes.map((route) => (
            <article
              key={route.id}
              className="fretron-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-800/50"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
                      {route.driver_name}
                    </h2>
                    <span className="badge-available rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                      Available
                    </span>
                  </div>
                  <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">
                    {route.origin_city} → {route.destination_city}
                  </p>

                  <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">Departure:</span>
                      <br />{new Date(route.departure_datetime).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">Arrival:</span>
                      <br />{route.estimated_arrival ? new Date(route.estimated_arrival).toLocaleString() : "—"}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">Capacity:</span>
                      <br />{route.available_capacity_kg} kg
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">Vehicle:</span>
                      <br />{route.vehicle_type}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-slate-700/50 dark:text-slate-400">
                    {route.operational_notes || "No extra notes."}
                  </div>
                </div>

                <div className="flex min-w-[280px] flex-col gap-3">
                  <select
                    value={selectedShipmentByRoute[route.id] || ""}
                    onChange={(e) =>
                      setSelectedShipmentByRoute((prev) => ({ ...prev, [route.id]: e.target.value }))
                    }
                    className="fretron-input rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400"
                  >
                    <option value="">Select your shipment post</option>
                    {shipments.map((shipment) => (
                      <option key={shipment.id} value={shipment.id}>
                        {shipment.shipment_code} | {shipment.pickup_city} → {shipment.destination_city}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRequest(route.id)}
                    className="fretron-btn rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Request This Route
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </UserDashboardShell>
  );
}
