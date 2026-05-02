import { useEffect, useState } from "react";
import UserDashboardShell from "./UserDashboardShell";
import { apiRequest } from "../../lib/api";

export default function ActiveBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  async function loadBookings() {
    try {
      const res = await apiRequest("/bookings/my-user?scope=active");
      setBookings(res.bookings || []);
    } catch (err) {
      setError(err.message || "Failed to load bookings");
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function respond(id, action) {
    try {
      await apiRequest(`/bookings/${id}/respond`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      loadBookings();
    } catch (err) {
      alert(err.message || "Failed to respond");
    }
  }

  async function cancelBooking(id) {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await apiRequest(`/bookings/${id}/cancel`, {
        method: "PATCH",
      });
      loadBookings();
    } catch (err) {
      alert(err.message || "Failed to cancel booking");
    }
  }

  return (
    <UserDashboardShell
      title="Active bookings"
      subtitle="Track all pending and live cargo bookings."
    >
      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="grid gap-5 lg:grid-cols-2">
        {bookings.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-slate-500">
            No active bookings found.
          </div>
        ) : (
          bookings.map((booking) => {
            const userNeedsToRespond = booking.booking_status === "pending" && booking.requester_role === "driver";
            return (
              <article key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-500">{booking.booking_code}</span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {booking.booking_status}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold text-slate-950">
                  {booking.shipment_code}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Shipment: {booking.pickup_city} → {booking.destination_city}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Driver route: {booking.origin_city} → {booking.route_destination_city}
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  Driver: <span className="font-medium text-slate-900">{booking.driver_name}</span>
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  {userNeedsToRespond && (
                    <>
                      <button onClick={() => respond(booking.id, "accept")} className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white">
                        Accept
                      </button>
                      <button onClick={() => respond(booking.id, "reject")} className="rounded-2xl border border-red-300 px-4 py-2.5 text-sm font-medium text-red-700">
                        Reject
                      </button>
                    </>
                  )}

                  {["pending", "accepted"].includes(booking.booking_status) && (
                    <button onClick={() => cancelBooking(booking.id)} className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">
                      Cancel
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </section>
    </UserDashboardShell>
  );
}