import { useEffect, useState } from "react";
import DriverDashboardShell from "./DriverDashboardShell";
import { apiRequest } from "../../lib/api";

export default function ActiveCargoPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  async function loadBookings() {
    try {
      const res = await apiRequest("/bookings/my-driver?scope=active");
      setBookings(res.bookings || []);
    } catch (err) {
      setError(err.message || "Failed to load active cargo");
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function respond(id, action) {
    try {
      await apiRequest(`/bookings/${id}/respond`, {
        method: "PATCH",
        headers: { "X-Fretron-Mode": "driver" },
        body: JSON.stringify({ action }),
      });
      loadBookings();
    } catch (err) {
      alert(err.message || "Failed to respond");
    }
  }

  async function updateStatus(id, status) {
    try {
      await apiRequest(`/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      loadBookings();
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  }

  return (
    <DriverDashboardShell
      title="Active cargo"
      subtitle="Accept requests and move cargo from pickup to delivery."
    >
      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-5 lg:grid-cols-2">
        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-slate-500">
            No active cargo right now.
          </div>
        ) : (
          bookings.map((booking) => {
            const driverNeedsToRespond = booking.booking_status === "pending" && booking.requester_role === "user";

            return (
              <article key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-500">{booking.booking_code}</span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {booking.booking_status}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold text-slate-950">{booking.shipment_code}</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Shipment: {booking.pickup_city} → {booking.destination_city}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Customer: {booking.user_name}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {driverNeedsToRespond && (
                    <>
                      <button onClick={() => respond(booking.id, "accept")} className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white">
                        Accept
                      </button>
                      <button onClick={() => respond(booking.id, "reject")} className="rounded-2xl border border-red-300 px-4 py-2.5 text-sm font-medium text-red-700">
                        Reject
                      </button>
                    </>
                  )}

                  {booking.booking_status === "accepted" && (
                    <button onClick={() => updateStatus(booking.id, "picked_up")} className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">
                      Mark Pickup
                    </button>
                  )}

                  {booking.booking_status === "picked_up" && (
                    <button onClick={() => updateStatus(booking.id, "in_transit")} className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">
                      Mark In Transit
                    </button>
                  )}

                  {booking.booking_status === "in_transit" && (
                    <button onClick={() => updateStatus(booking.id, "delivered")} className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white">
                      Mark Delivered
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </DriverDashboardShell>
  );
}
