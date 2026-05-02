import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

export default function DriverStatus() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [reason, setReason] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const response = await apiRequest("/applications/driver/status");
        const profile = response.driverProfile;

        if (!profile) {
          navigate("/driver-signup", { replace: true });
          return;
        }

        if (profile.verification_status === "approved") {
          navigate("/driver-dashboard", { replace: true });
          return;
        }

        if (!cancelled) {
          setStatus(profile.verification_status);
          setReason(profile.rejection_reason || "");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    loadStatus();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-200">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-semibold text-white">F</div>
        <h1 className="text-2xl font-semibold text-slate-950">Driver application status</h1>

        {status === "loading" && <p className="mt-4 text-slate-600">Checking your driver profile...</p>}

        {status === "pending" && (
          <p className="mt-4 text-slate-600">
            Your driver request is pending. Fretron admin will review your details before driver mode is enabled.
          </p>
        )}

        {status === "rejected" && (
          <div className="mt-4 text-slate-600">
            <p>Your driver request was rejected. You can update your details and apply again.</p>
            {reason && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{reason}</p>}
            <Link to="/driver-signup" className="mt-6 inline-flex rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white">
              Reapply
            </Link>
          </div>
        )}

        {status === "error" && <p className="mt-4 text-red-600">Could not load your driver status. Please sign in again.</p>}

        <div className="mt-6">
          <Link to="/user-dashboard" className="text-sm font-medium text-blue-600">Back to user dashboard</Link>
        </div>
      </div>
    </div>
  );
}
