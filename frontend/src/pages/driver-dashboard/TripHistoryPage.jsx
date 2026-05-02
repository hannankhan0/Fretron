import { useEffect, useState } from "react";
import DriverDashboardShell from "./DriverDashboardShell";
import { apiRequest } from "../../lib/api";

export default function TripHistoryPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest("/bookings/my-driver?scope=history");
        setBookings(res.bookings || []);
      } catch (err) {
        setError(err.message || "Failed to load trip history");
      }
    })();
  }, []);

  return (
    <DriverDashboardShell
      title="Trip history"
      subtitle="See delivered, cancelled, and rejected cargo records."
    >
      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {bookings.length === 0 ? (
          <div className="text-slate-500">No trip history yet.</div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{item.booking_code}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {item.pickup_city} → {item.destination_city}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600">{new Date(item.created_at).toLocaleString()}</div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {item.booking_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </DriverDashboardShell>
  );
}