import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import UserDashboardShell from "./UserDashboardShell";
import { apiRequest } from "../../lib/api";

export default function UserDashboardHome() {
  const navigate = useNavigate();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  const [data, setData] = useState({
    stats: {
      shipmentPosts: 0,
      activeBookings: 0,
      completedBookings: 0,
      unreadNotifications: 0,
    },
    recentShipments: [],
    recentBookings: [],
  });

  const [error, setError] = useState("");

  async function getAuthHeaders() {
    const token = await getToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async function syncCurrentUser() {
    const headers = await getAuthHeaders();

    await apiRequest("/auth/clerk/sync-user", {
      method: "POST",
      headers,
      body: JSON.stringify({
        fullName: user?.fullName || user?.username || "Fretron User",
        email: user?.primaryEmailAddress?.emailAddress,
        phone: user?.primaryPhoneNumber?.phoneNumber || null,
        businessName: null,
      }),
    });
  }

  async function handleSwitchToDriverMode() {
  try {
    setError("");

    const headers = await getAuthHeaders();

    const response = await apiRequest("/applications/driver/status", {
      headers,
    });

    const status =
      response.status ||
      response.driverProfile?.verification_status ||
      "none";

    if (status === "approved") {
      navigate("/driver-dashboard");
      return;
    }

    if (status === "pending") {
      navigate("/driver-status");
      return;
    }

    if (status === "rejected") {
      navigate("/driver-status");
      return;
    }

    navigate("/driver-signup");
  } catch (err) {
    setError(err.message || "Could not check driver status");
  }
}

  useEffect(() => {
    async function loadDashboard() {
      try {
        if (!isLoaded) return;

        if (!isSignedIn) {
          navigate("/user-login");
          return;
        }

        if (!user) return;

        setError("");

        await syncCurrentUser();

        const headers = await getAuthHeaders();
        const res = await apiRequest("/dashboard/user", {
          headers,
        });

        setData(res);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      }
    }

    loadDashboard();
  }, [isLoaded, isSignedIn, user]);

  const actions = (
    <>
      <Link
        to="/user-dashboard/post-shipment"
        className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
      >
        Post Shipment
      </Link>

      <Link
        to="/user-dashboard/browse-routes"
        className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
      >
        Browse Routes
      </Link>

      <button
        type="button"
        onClick={handleSwitchToDriverMode}
        className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700"
      >
        Switch to Driver Mode
      </button>
    </>
  );

  return (
    <UserDashboardShell
      title="User operations overview"
      subtitle="Manage shipment posts, booking responses, and active logistics flow."
      actions={actions}
    >
      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Shipment Posts", data.stats.shipmentPosts],
          ["Active Bookings", data.stats.activeBookings],
          ["Completed Bookings", data.stats.completedBookings],
          ["Unread Notifications", data.stats.unreadNotifications],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="text-sm font-medium text-slate-500">{label}</div>
            <div className="mt-3 text-3xl font-semibold text-slate-950">
              {value}
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Recent shipment posts</h2>

          <div className="mt-4 space-y-3">
            {data.recentShipments.length === 0 ? (
              <p className="text-sm text-slate-500">No shipment posts yet.</p>
            ) : (
              data.recentShipments.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="font-medium text-slate-900">
                    {item.shipment_code}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {item.pickup_city} → {item.destination_city}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {item.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Recent bookings</h2>

          <div className="mt-4 space-y-3">
            {data.recentBookings.length === 0 ? (
              <p className="text-sm text-slate-500">No bookings yet.</p>
            ) : (
              data.recentBookings.map((item, index) => (
                <div
                  key={`${item.booking_code}-${index}`}
                  className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="font-medium text-slate-900">
                    {item.booking_code}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {item.booking_status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </UserDashboardShell>
  );
}