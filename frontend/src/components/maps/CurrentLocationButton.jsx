import { useRef, useState } from "react";
import { apiRequest } from "../../lib/api";

const GPS_WINDOW_MS = 8000;   // max time to collect readings
const GPS_MIN_GOOD  = 20;     // stop early if accuracy ≤ 20 m

/**
 * CurrentLocationButton
 * Uses watchPosition to collect multiple GPS fixes and pick the most
 * accurate one (lowest accuracy value = tightest circle).
 * Stops early if a ≤20 m fix is obtained; otherwise uses the best
 * reading after GPS_WINDOW_MS.
 *
 * Props:
 *   onLocation(place)  — called with {lat,lng,name,city,label,_fromGps,_accuracy}
 *   compact            — if true, icon-only button (no text)
 */
export default function CurrentLocationButton({ onLocation, compact = false }) {
  const [state, setState]     = useState("idle");   // idle | locating | error
  const [accuracy, setAccuracy] = useState(null);   // live accuracy in metres
  const [errorMsg, setErrorMsg] = useState("");

  const watchIdRef  = useRef(null);
  const bestRef     = useRef(null);   // { lat, lng, accuracy }
  const timerRef    = useRef(null);
  const doneRef     = useRef(false);  // guard against double-resolution

  function stopWatch() {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    clearTimeout(timerRef.current);
  }

  async function useReading({ lat, lng, accuracy: acc }) {
    if (doneRef.current) return;
    doneRef.current = true;
    stopWatch();

    try {
      const res   = await apiRequest(`/maps/reverse?lat=${lat.toFixed(6)}&lng=${lng.toFixed(6)}`);
      const place = { ...res.place, _fromGps: true, _accuracy: Math.round(acc) };
      onLocation(place);
    } catch {
      onLocation({
        lat,
        lng,
        name:    "Current location",
        city:    "",
        state:   "",
        country: "Pakistan",
        label:   `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        _fromGps:   true,
        _accuracy:  Math.round(acc),
      });
    }

    setState("idle");
    setAccuracy(null);
  }

  function handleClick() {
    if (!navigator.geolocation) {
      setState("error");
      setErrorMsg("Location not supported in this browser");
      return;
    }

    // Reset
    doneRef.current = false;
    bestRef.current = null;
    setState("locating");
    setAccuracy(null);
    setErrorMsg("");

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;

        // Update live accuracy display
        setAccuracy(Math.round(acc));

        // Keep best (most accurate) reading
        if (!bestRef.current || acc < bestRef.current.accuracy) {
          bestRef.current = { lat, lng, accuracy: acc };
        }

        // Stop early if we already have a good enough fix
        if (acc <= GPS_MIN_GOOD) {
          useReading(bestRef.current);
        }
      },
      (err) => {
        if (doneRef.current) return;
        doneRef.current = true;
        stopWatch();
        setState("error");
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMsg("Location permission denied");
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setErrorMsg("Location unavailable");
        } else {
          setErrorMsg("Could not get location");
        }
        setTimeout(() => { setState("idle"); setErrorMsg(""); setAccuracy(null); }, 3500);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    // After GPS_WINDOW_MS use the best reading we collected, whatever it is
    timerRef.current = setTimeout(() => {
      if (doneRef.current) return;
      if (bestRef.current) {
        useReading(bestRef.current);
      } else {
        // watchPosition errored or produced nothing yet — show error
        doneRef.current = true;
        stopWatch();
        setState("error");
        setErrorMsg("Could not get location — try again");
        setTimeout(() => { setState("idle"); setErrorMsg(""); setAccuracy(null); }, 3500);
      }
    }, GPS_WINDOW_MS);
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
            <span className="relative flex h-3 w-3 flex-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500" />
            </span>
            {!compact && (
              <span>
                {accuracy != null ? `Locating… ±${accuracy}m` : "Locating…"}
              </span>
            )}
          </>
        ) : isError ? (
          <>
            <span className="flex-none text-sm">⚠</span>
            {!compact && <span>{errorMsg || "Error"}</span>}
          </>
        ) : (
          <>
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
