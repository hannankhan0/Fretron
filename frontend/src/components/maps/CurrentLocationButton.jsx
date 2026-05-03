import { useState } from "react";
import { apiRequest } from "../../lib/api";

/**
 * CurrentLocationButton
 * Detects user's GPS position, reverse-geocodes it via /api/maps/reverse,
 * and calls onLocation(place) with a full place object.
 *
 * Props:
 *   onLocation(place)  — called with {lat,lng,name,city,label,...}
 *   compact            — if true, icon-only button (no text)
 */
export default function CurrentLocationButton({ onLocation, compact = false }) {
  const [state, setState] = useState("idle"); // idle | locating | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleClick() {
    if (!navigator.geolocation) {
      setState("error");
      setErrorMsg("Location not supported in this browser");
      return;
    }

    setState("locating");
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        try {
          const res = await apiRequest(
            `/maps/reverse?lat=${lat.toFixed(6)}&lng=${lng.toFixed(6)}`
          );
          const place = { ...res.place, _fromGps: true, _accuracy: Math.round(accuracy) };
          onLocation(place);
          setState("idle");
        } catch {
          // Fallback: bare coords if reverse geocoding fails
          onLocation({
            lat,
            lng,
            name: "Current location",
            city: "",
            state: "",
            country: "Pakistan",
            label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            _fromGps: true,
            _accuracy: Math.round(accuracy),
          });
          setState("idle");
        }
      },
      (err) => {
        setState("error");
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg("Location permission denied");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setErrorMsg("Location unavailable");
        } else {
          setErrorMsg("Location timed out");
        }
        // Clear error after 3 s
        setTimeout(() => { setState("idle"); setErrorMsg(""); }, 3000);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  }

  const isLocating = state === "locating";
  const isError    = state === "error";

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isLocating}
        title={compact ? "Use my current location" : undefined}
        className={`
          flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold
          transition-all duration-200
          disabled:cursor-not-allowed
          ${isError
            ? "border-red-300 bg-red-50 text-red-600"
            : isLocating
            ? "border-blue-300 bg-blue-50 text-blue-600"
            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
          }
        `}
      >
        {isLocating ? (
          <>
            {/* Pulsing GPS dot */}
            <span className="relative flex h-3 w-3 flex-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
            </span>
            {!compact && <span>Locating…</span>}
          </>
        ) : isError ? (
          <>
            <span className="flex-none text-sm">⚠</span>
            {!compact && <span>{errorMsg || "Error"}</span>}
          </>
        ) : (
          <>
            {/* GPS crosshair icon */}
            <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5 flex-none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="10" cy="10" r="3.5" />
              <line x1="10" y1="1" x2="10" y2="5" />
              <line x1="10" y1="15" x2="10" y2="19" />
              <line x1="1" y1="10" x2="5" y2="10" />
              <line x1="15" y1="10" x2="19" y2="10" />
            </svg>
            {!compact && <span>Use my location</span>}
          </>
        )}
      </button>

      {isError && errorMsg && !compact && (
        <p className="text-[11px] text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}
