import { useEffect, useState } from "react";
import UserDashboardShell from "./UserDashboardShell";
import { apiRequest } from "../../lib/api";

export default function BrowseDriversPage() {
  const [routes, setRoutes] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [selectedShipmentByRoute, setSelectedShipmentByRoute] = useState({});
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [routesRes, shipmentsRes] = await Promise.all([
        apiRequest("/routes"),
        apiRequest("/shipments/my?status=published"),
      ]);
      setRoutes(routesRes.routes || []);
      setShipments(shipmentsRes.shipments || []);
    } catch (err) {
      setError(err.message || "Failed to load marketplace routes");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleRequest(routeId) {
    const shipmentId = selectedShipmentByRoute[routeId];
    if (!shipmentId) {
      alert("Please select one of your shipment posts first.");
      return;
    }

    try {
      await apiRequest("/bookings", {
        method: "POST",
        body: JSON.stringify({
          shipmentPostId: shipmentId,
          routePostId: routeId,
        }),
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
      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {shipments.length === 0 && (
        <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          You need at least one published shipment post before requesting a driver route.
        </div>
      )}

      <section className="space-y-5">
        {routes.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-slate-500">
            No driver routes available right now.
          </div>
        ) : (
          routes.map((route) => (
            <article key={route.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-semibold text-slate-950">{route.driver_name}</h2>
                  <p className="mt-2 text-lg text-slate-700">{route.origin_city} → {route.destination_city}</p>

                  <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                    <div><span className="font-semibold text-slate-900">Departure:</span><br />{new Date(route.departure_datetime).toLocaleString()}</div>
                    <div><span className="font-semibold text-slate-900">Arrival:</span><br />{route.estimated_arrival ? new Date(route.estimated_arrival).toLocaleString() : "-"}</div>
                    <div><span className="font-semibold text-slate-900">Capacity:</span><br />{route.available_capacity_kg} kg</div>
                    <div><span className="font-semibold text-slate-900">Vehicle:</span><br />{route.vehicle_type}</div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    {route.operational_notes || "No extra notes."}
                  </div>
                </div>

                <div className="flex min-w-[280px] flex-col gap-3">
                  <select
                    value={selectedShipmentByRoute[route.id] || ""}
                    onChange={(e) =>
                      setSelectedShipmentByRoute((prev) => ({
                        ...prev,
                        [route.id]: e.target.value,
                      }))
                    }
                    className="rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                    className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
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