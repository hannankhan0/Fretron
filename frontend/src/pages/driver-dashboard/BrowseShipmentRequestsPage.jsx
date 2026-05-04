import { useEffect, useState } from "react";
import DriverDashboardShell from "./DriverDashboardShell";
import { apiRequest } from "../../lib/api";
import { useClerkApi } from "../../lib/useClerkApi";

function SkeletonCard() {
  return (
    <div className="glass rounded-3xl p-6 shadow-sm">
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

export default function BrowseShipmentRequestsPage() {
  const [shipments, setShipments] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteByShipment, setSelectedRouteByShipment] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const apiReady = useClerkApi();

  async function loadData() {
    try {
      setLoading(true);
      const [shipmentsRes, routesRes] = await Promise.all([
        apiRequest("/shipments"),
        apiRequest("/routes/my?status=published", { headers: { "X-Fretron-Mode": "driver" } }),
      ]);
      setShipments(shipmentsRes.shipments || []);
      setRoutes(routesRes.routes || []);
    } catch (err) {
      setError(err.message || "Failed to load shipment marketplace");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (!apiReady) return; loadData(); }, [apiReady]);

  async function handleOffer(shipmentId) {
    const routeId = selectedRouteByShipment[shipmentId];
    if (!routeId) {
      alert("Please select one of your route posts first.");
      return;
    }
    try {
      await apiRequest("/bookings", {
        method: "POST",
        headers: { "X-Fretron-Mode": "driver" },
        body: JSON.stringify({ shipmentPostId: shipmentId, routePostId: routeId }),
      });
      alert("Offer sent successfully.");
      loadData();
    } catch (err) {
      alert(err.message || "Failed to send offer");
    }
  }

  return (
    <DriverDashboardShell
      title="Browse shipment requests"
      subtitle="Attach one of your live route posts to a shipment request."
    >
      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && routes.length === 0 && (
        <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          You need at least one published route post before offering on shipments.
        </div>
      )}

      <section className="space-y-5">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : shipments.length === 0 ? (
          <div className="glass glass-hover rounded-3xl p-10 text-center shadow-sm">
            {/* Empty state */}
            <div className="animate-fade-in-scale mx-auto mb-4 text-5xl">📦</div>
            <p className="text-base font-medium text-slate-500 dark:text-slate-400">
              No shipment requests available right now.
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Check back soon — shippers are posting daily.
            </p>
          </div>
        ) : (
          shipments.map((item) => (
            <article
              key={item.id}
              className="glass glass-hover rounded-3xl p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-50">
                      {item.shipper_name}
                    </h2>
                    <span className="glass-badge rounded-full px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      Open
                    </span>
                  </div>
                  <p className="mt-2 text-lg text-slate-700 dark:text-slate-300">
                    {item.pickup_city} → {item.destination_city}
                  </p>

                  <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">Category:</span>
                      <br />{item.parcel_category}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">Urgency:</span>
                      <br />{item.urgency}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">Weight:</span>
                      <br />{item.weight_kg} kg
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-200">Budget:</span>
                      <br />{item.budget || "—"}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl glass px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    {item.handling_notes || "No special handling notes."}
                  </div>
                </div>

                <div className="flex min-w-[280px] flex-col gap-3">
                  <select
                    value={selectedRouteByShipment[item.id] || ""}
                    onChange={(e) =>
                      setSelectedRouteByShipment((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    className="fretron-input glass-input rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:text-slate-100 dark:focus:border-blue-400"
                  >
                    <option value="">Select your route post</option>
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.route_code} | {route.origin_city} → {route.destination_city}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleOffer(item.id)}
                    className="fretron-btn rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Offer This Route
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </DriverDashboardShell>
  );
}
