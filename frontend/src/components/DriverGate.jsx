import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

export default function DriverGate({ children }) {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkDriverStatus() {
      try {
        const response = await apiRequest("/applications/driver/status");
        const status = response.driverProfile?.verification_status || "none";

        if (status === "approved") {
          if (!cancelled) setAllowed(true);
          return;
        }

        if (!cancelled) navigate("/driver-status", { replace: true });
      } catch {
        if (!cancelled) navigate("/driver-status", { replace: true });
      }
    }

    checkDriverStatus();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (!allowed) return null;

  return children;
}
