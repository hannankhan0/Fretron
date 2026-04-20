import { useEffect, useState } from "react";
import UserDashboardShell from "./UserDashboardShell";
import { apiRequest } from "../../lib/api";

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      const res = await apiRequest("/notifications");
      setNotifications(res.notifications || []);
    } catch (err) {
      setError(err.message || "Failed to load notifications");
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function markRead(id) {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: "PATCH" });
      loadNotifications();
    } catch (err) {
      alert(err.message || "Failed to mark notification as read");
    }
  }

  return (
    <UserDashboardShell
      title="Notifications and alerts"
      subtitle="Booking requests, responses, and movement updates appear here."
    >
      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-slate-500">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notification) => (
            <article key={notification.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-blue-700">
                  {notification.type}
                </div>
                <div className="text-sm text-slate-500">
                  {new Date(notification.created_at).toLocaleString()}
                </div>
              </div>

              <h2 className="mt-4 text-xl font-semibold text-slate-950">{notification.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{notification.body}</p>

              {!notification.is_read && (
                <button
                  onClick={() => markRead(notification.id)}
                  className="mt-4 rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  Mark as read
                </button>
              )}
            </article>
          ))
        )}
      </section>
    </UserDashboardShell>
  );
}