import { useEffect, useState } from "react";
import DriverDashboardShell from "./DriverDashboardShell";
import { apiRequest } from "../../lib/api";

export default function BrowseShipmentRequestsPage() {
  const [shipments, setShipments] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteByShipment, setSelectedRouteByShipment] = useState({});
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [shipmentsRes, routesRes] = await Promise.all([
        apiRequest("/shipments"),
        apiRequest("/routes/my?status=published"),
      ]);

      setShipments(shipmentsRes.shipments || []);
      setRoutes(routesRes.routes || []);
    } catch (err) {
      setError(err.message || "Failed to load shipment marketplace");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

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
        body: JSON.stringify({
          shipmentPostId: shipmentId,
          routePostId: routeId,
        }),
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
      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {routes.length === 0 && (
        <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          You need at least one published route post before offering on shipments.
        </div>
      )}

      <section className="space-y-5">
        {shipments.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-slate-500">
            No shipment requests available right now.
          </div>
        ) : (
          shipments.map((item) => (
            <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-semibold text-slate-950">{item.shipper_name}</h2>
                  <p className="mt-2 text-lg text-slate-700">{item.pickup_city} → {item.destination_city}</p>

                  <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                    <div><span className="font-semibold text-slate-900">Category:</span><br />{item.parcel_category}</div>
                    <div><span className="font-semibold text-slate-900">Urgency:</span><br />{item.urgency}</div>
                    <div><span className="font-semibold text-slate-900">Weight:</span><br />{item.weight_kg} kg</div>
                    <div><span className="font-semibold text-slate-900">Budget:</span><br />{item.budget || "-"}</div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {item.handling_notes || "No special handling notes."}
                  </div>
                </div>

                <div className="flex min-w-[280px] flex-col gap-3">
                  <select
                    value={selectedRouteByShipment[item.id] || ""}
                    onChange={(e) =>
                      setSelectedRouteByShipment((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
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
