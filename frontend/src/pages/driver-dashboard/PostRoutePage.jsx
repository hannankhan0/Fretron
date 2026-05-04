import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import DriverDashboardShell from "./DriverDashboardShell";
import LocationSearchInput from "../../components/maps/LocationSearchInput";
import CurrentLocationButton from "../../components/maps/CurrentLocationButton";
import { apiRequest } from "../../lib/api";

// ── Icons ─────────────────────────────────────────────────────────────────────
function makeDivIcon(bg, label) {
  return new L.DivIcon({
    html: `<div style="
      background:${bg};width:28px;height:28px;border-radius:50%;
      border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,.35);
      display:flex;align-items:center;justify-content:center;
      color:white;font-size:11px;font-weight:800;
    ">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    className: "",
  });
}

const originIcon = makeDivIcon("#16a34a", "A");
const destIcon   = makeDivIcon("#dc2626", "B");
const wpIcon     = (n) => makeDivIcon("#ea580c", n + 1);

// ── Route config ──────────────────────────────────────────────────────────────
const ROUTE_COLORS = ["#2563eb", "#f97316", "#7c3aed"];
const ROUTE_LABELS = ["Fastest route", "Alternative 1", "Alternative 2"];

// ── Dropdown values ───────────────────────────────────────────────────────────
const VEHICLE_TYPES = [
  "Mini Truck (1–2 ton)",
  "Pickup (1 ton)",
  "Mazda (3 ton)",
  "Medium Truck (5–7 ton)",
  "Heavy Truck (10–15 ton)",
  "Trailer (20+ ton)",
  "Motorcycle / Rickshaw",
  "Other",
];

const PRICING_MODELS = ["Per kg", "Per km", "Flat rate", "Negotiable"];

// ── Map helpers ───────────────────────────────────────────────────────────────
function MapFitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions?.length >= 2) {
      map.fitBounds(L.latLngBounds(positions), { padding: [60, 60] });
    }
  }, [positions, map]);
  return null;
}

// ── Waypoint search row (inline panel search) ─────────────────────────────────
function WaypointSearchRow({ index, onAdd, onCancel }) {
  return (
    <div className="animate-dropdown rounded-2xl border border-orange-200 bg-orange-50/70 p-2.5 dark:border-orange-900/50 dark:bg-orange-950/20">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400">
          Stop {index + 1}
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-red-500"
        >
          Cancel
        </button>
      </div>
      <LocationSearchInput
        placeholder="Search city, area or landmark in Pakistan…"
        onSelect={(place) => onAdd(place)}
        onClear={() => {}}
      />
    </div>
  );
}

// ── Form initial state ────────────────────────────────────────────────────────
const INITIAL_FORM = {
  departureDatetime:   "",
  estimatedArrival:    "",
  availableCapacityKg: "",
  vehicleType:         "",
  pricingModel:        "",
  priceAmount:         "",
  restrictions:        "",
  operationalNotes:    "",
  status:              "published",
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PostRoutePage() {
  const navigate = useNavigate();

  // Location state
  const [originLocation, setOriginLocation] = useState(null);
  const [destLocation, setDestLocation]     = useState(null);
  const [waypoints, setWaypoints]           = useState([]);
  const [addingWaypoint, setAddingWaypoint] = useState(false);

  // Route state
  const [routes, setRoutes]                     = useState([]);
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [loadingRoute, setLoadingRoute]         = useState(false);
  const [routeError, setRouteError]             = useState("");
  const routeTimer                              = useRef(null);

  // Form state
  const [form, setForm]           = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── Auto-fetch routes ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!originLocation || !destLocation) {
      setRoutes([]);
      setRouteError("");
      return;
    }
    clearTimeout(routeTimer.current);
    routeTimer.current = setTimeout(fetchRoutes, 450);
    return () => clearTimeout(routeTimer.current);
  }, [originLocation, destLocation, waypoints]);

  async function fetchRoutes() {
    try {
      setLoadingRoute(true);
      setRouteError("");
      const params = new URLSearchParams({
        originLat: originLocation.lat,
        originLng: originLocation.lng,
        destLat:   destLocation.lat,
        destLng:   destLocation.lng,
      });
      if (waypoints.length) {
        params.set("waypoints", waypoints.map((w) => `${w.lat},${w.lng}`).join(";"));
      }
      const res = await apiRequest(`/maps/route?${params}`);
      setRoutes(res.routes || []);
      setSelectedRouteIdx(0);
    } catch {
      setRouteError("Could not load routes. Check your locations and try again.");
      setRoutes([]);
    } finally {
      setLoadingRoute(false);
    }
  }

  // ── Waypoints ──────────────────────────────────────────────────────────────
  function handleAddWaypoint(place) {
    setWaypoints((prev) => [...prev, { lat: place.lat, lng: place.lng, name: place.name || place.label }]);
    setAddingWaypoint(false);
  }

  function removeWaypoint(i) {
    setWaypoints((prev) => prev.filter((_, idx) => idx !== i));
  }

  // ── Form helpers ───────────────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    if (!originLocation)          return setSubmitError("Please select an origin location.");
    if (!destLocation)            return setSubmitError("Please select a destination.");
    if (!form.departureDatetime)  return setSubmitError("Departure date and time is required.");
    if (!form.availableCapacityKg) return setSubmitError("Available capacity is required.");
    if (!form.vehicleType)        return setSubmitError("Vehicle type is required.");
    if (!form.pricingModel)       return setSubmitError("Pricing model is required.");

    const selectedRoute = routes[selectedRouteIdx];

    const payload = {
      originCity:        originLocation.city || originLocation.name,
      destinationCity:   destLocation.city   || destLocation.name,
      originLat:         originLocation.lat,
      originLng:         originLocation.lng,
      destinationLat:    destLocation.lat,
      destinationLng:    destLocation.lng,
      routeDistanceKm:   selectedRoute?.distanceKm  ?? null,
      routeDurationText: selectedRoute?.durationText ?? null,
      ...form,
    };

    try {
      setSubmitting(true);
      await apiRequest("/routes", {
        method: "POST",
        headers: { "X-Fretron-Mode": "driver" },
        body: JSON.stringify(payload),
      });
      navigate("/driver-dashboard/route-posts");
    } catch (err) {
      setSubmitError(err.message || "Failed to publish route. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Derived map data ───────────────────────────────────────────────────────
  const selectedRoute  = routes[selectedRouteIdx];
  const routePositions = selectedRoute
    ? selectedRoute.geometry.coordinates.map(([lng, lat]) => [lat, lng])
    : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <DriverDashboardShell mapMode>
      <div className="flex h-screen w-full overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <aside className="w-[460px] flex-none overflow-y-auto border-r border-slate-200/60 glass glass-shimmer dark:border-slate-800">

          {/* Sticky header */}
          <div className="sticky top-0 z-10 glass-header border-b border-white/40 px-6 pb-4 pt-6 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-600">
              Driver Dashboard
            </div>
            <h1 className="mt-1.5 text-xl font-bold text-slate-950 dark:text-slate-50">Post a Route</h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Set your origin and destination, add stops if needed, then fill in trip details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-8">

            {/* ── Route ── */}
            <section className="pt-5">
              <SectionHeading icon="📍" title="Route" />

              <div className="mt-3 space-y-3">

                {/* Origin */}
                <LocationSearchInput
                  label="Origin city"
                  placeholder="Where are you departing from?"
                  selectedName={originLocation?.name || ""}
                  selected={originLocation}
                  onSelect={setOriginLocation}
                  onClear={() => { setOriginLocation(null); setRoutes([]); }}
                />

                {/* Current location shortcut */}
                <div>
                  <CurrentLocationButton onLocation={setOriginLocation} />
                  {originLocation?._fromGps && (
                    <p className="mt-1 text-[11px] text-blue-600 dark:text-blue-400">
                      📡 GPS location — accuracy ±{originLocation._accuracy}m
                    </p>
                  )}
                </div>

                {/* Destination */}
                <LocationSearchInput
                  label="Destination city"
                  placeholder="Where are you heading?"
                  selectedName={destLocation?.name || ""}
                  selected={destLocation}
                  onSelect={setDestLocation}
                  onClear={() => { setDestLocation(null); setRoutes([]); }}
                />
              </div>

              {/* Custom stops */}
              {originLocation && destLocation && (
                <div className="mt-3 rounded-2xl glass p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Custom stops (optional)
                      {waypoints.length > 0 && (
                        <span className="ml-1.5 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                          {waypoints.length}
                        </span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      {waypoints.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setWaypoints([])}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                      {!addingWaypoint && (
                        <button
                          type="button"
                          onClick={() => setAddingWaypoint(true)}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                        >
                          + Add stop
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline search for new stop */}
                  {addingWaypoint && (
                    <div className="mt-2.5">
                      <WaypointSearchRow
                        index={waypoints.length}
                        onAdd={handleAddWaypoint}
                        onCancel={() => setAddingWaypoint(false)}
                      />
                    </div>
                  )}

                  {/* Existing stops list */}
                  {waypoints.length > 0 && (
                    <ul className="mt-2 space-y-1.5">
                      {waypoints.map((wp, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 rounded-xl border border-orange-100/70 bg-orange-50/60 px-3 py-2 text-xs dark:border-orange-900/40 dark:bg-orange-950/20"
                        >
                          <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                            {i + 1}
                          </span>
                          <span className="flex-1 truncate font-medium text-orange-800 dark:text-orange-300">
                            {wp.name || `${wp.lat.toFixed(4)}, ${wp.lng.toFixed(4)}`}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeWaypoint(i)}
                            className="text-base font-bold leading-none text-red-400 hover:text-red-600"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Route loading / error */}
              {loadingRoute && (
                <div className="mt-3 flex items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                  <svg className="h-4 w-4 animate-spin flex-none" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Calculating road routes…
                </div>
              )}
              {routeError && !loadingRoute && (
                <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                  {routeError}
                </div>
              )}

              {/* Route alternatives */}
              {routes.length > 0 && !loadingRoute && (
                <div className="mt-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Select your route
                  </p>
                  <div className="space-y-2">
                    {routes.map((route, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedRouteIdx(i)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                          selectedRouteIdx === i
                            ? "border-blue-500 bg-blue-50/70 shadow-md shadow-blue-100/60 dark:border-blue-600 dark:bg-blue-950/40"
                            : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/70 dark:hover:bg-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="h-3 w-3 flex-none rounded-full" style={{ background: ROUTE_COLORS[i] ?? "#6b7280" }} />
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {ROUTE_LABELS[i] ?? `Route ${i + 1}`}
                            </span>
                          </div>
                          {selectedRouteIdx === i && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {route.distanceKm} km &nbsp;·&nbsp; ~{route.durationText}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <Divider />

            {/* ── Schedule ── */}
            <section>
              <SectionHeading icon="🗓" title="Schedule" />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Field
                  label="Departure date & time"
                  type="datetime-local"
                  name="departureDatetime"
                  value={form.departureDatetime}
                  onChange={handleChange}
                  required
                  colSpan
                />
                <Field
                  label="Estimated arrival"
                  type="datetime-local"
                  name="estimatedArrival"
                  value={form.estimatedArrival}
                  onChange={handleChange}
                />
              </div>
            </section>

            <Divider />

            {/* ── Vehicle & Capacity ── */}
            <section>
              <SectionHeading icon="🚛" title="Vehicle & Capacity" />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Vehicle type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    required
                    className="fretron-input glass-input w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:text-slate-100"
                  >
                    <option value="">Select vehicle type</option>
                    {VEHICLE_TYPES.map((vt) => <option key={vt} value={vt}>{vt}</option>)}
                  </select>
                </div>

                <Field
                  label="Available capacity (kg)"
                  type="number"
                  name="availableCapacityKg"
                  value={form.availableCapacityKg}
                  onChange={handleChange}
                  placeholder="e.g. 2000"
                  required
                  min="1"
                />
              </div>
            </section>

            <Divider />

            {/* ── Pricing ── */}
            <section>
              <SectionHeading icon="💰" title="Pricing" />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Pricing model <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="pricingModel"
                    value={form.pricingModel}
                    onChange={handleChange}
                    required
                    className="fretron-input glass-input w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:text-slate-100"
                  >
                    <option value="">Select model</option>
                    {PRICING_MODELS.map((pm) => <option key={pm} value={pm}>{pm}</option>)}
                  </select>
                </div>

                <Field
                  label="Price amount (PKR)"
                  type="number"
                  name="priceAmount"
                  value={form.priceAmount}
                  onChange={handleChange}
                  placeholder="e.g. 15000"
                  min="0"
                />
              </div>
            </section>

            <Divider />

            {/* ── Additional ── */}
            <section>
              <SectionHeading icon="📝" title="Additional details" />
              <div className="mt-3 space-y-3">
                <Field
                  label="Restrictions"
                  name="restrictions"
                  value={form.restrictions}
                  onChange={handleChange}
                  placeholder="e.g. No liquids, no electronics"
                />

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Operational notes
                  </label>
                  <textarea
                    name="operationalNotes"
                    rows="3"
                    value={form.operationalNotes}
                    onChange={handleChange}
                    placeholder="Any extra details for potential shippers…"
                    className="fretron-input glass-input w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="fretron-input glass-input w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:text-slate-100"
                  >
                    <option value="published">Published (visible to shippers)</option>
                    <option value="draft">Draft (hidden)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* ── Submit ── */}
            {submitError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="fretron-btn w-full rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Publishing…" : "Publish Route 🚀"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/driver-dashboard/route-posts")}
              className="fretron-btn w-full rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

          </form>
        </aside>

        {/* ── RIGHT: Map ── */}
        <div className="relative flex-1">
          <MapContainer
            center={[30.3753, 69.3451]}
            zoom={5}
            zoomControl={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />

            {routePositions && <MapFitBounds positions={routePositions} />}

            {/* Non-selected routes */}
            {routes.map((route, i) => {
              if (i === selectedRouteIdx) return null;
              return (
                <Polyline
                  key={i}
                  positions={route.geometry.coordinates.map(([lng, lat]) => [lat, lng])}
                  pathOptions={{ color: "#94a3b8", weight: 4, opacity: 0.45, dashArray: "8,6" }}
                />
              );
            })}

            {/* Selected route */}
            {routePositions && (
              <Polyline
                positions={routePositions}
                pathOptions={{ color: ROUTE_COLORS[selectedRouteIdx] ?? ROUTE_COLORS[0], weight: 6, opacity: 0.9 }}
              />
            )}

            {originLocation && (
              <Marker position={[originLocation.lat, originLocation.lng]} icon={originIcon}>
                <Popup>
                  <strong>Origin</strong><br />
                  {originLocation.label || originLocation.name}
                  {originLocation._fromGps && (
                    <span className="ml-1 rounded bg-blue-100 px-1 text-[10px] text-blue-700">
                      GPS ±{originLocation._accuracy}m
                    </span>
                  )}
                </Popup>
              </Marker>
            )}

            {destLocation && (
              <Marker position={[destLocation.lat, destLocation.lng]} icon={destIcon}>
                <Popup><strong>Destination</strong><br />{destLocation.label || destLocation.name}</Popup>
              </Marker>
            )}

            {waypoints.map((wp, i) => (
              <Marker key={i} position={[wp.lat, wp.lng]} icon={wpIcon(i)}>
                <Popup>
                  <strong>Stop {i + 1}</strong><br />
                  {wp.name || `${wp.lat.toFixed(4)}, ${wp.lng.toFixed(4)}`}<br />
                  <button className="mt-1 text-xs text-red-600 underline" onClick={() => removeWaypoint(i)}>
                    Remove
                  </button>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Hint when map is empty */}
          {!originLocation && !destLocation && (
            <div className="pointer-events-none absolute left-1/2 top-8 z-[500] -translate-x-1/2 rounded-2xl glass-dark px-5 py-3 text-sm font-medium text-white shadow-xl">
              Search cities in the left panel to see your route here
            </div>
          )}

          {/* Route summary badge */}
          {selectedRoute && (
            <div className="absolute right-4 top-4 z-[500] glass rounded-2xl px-4 py-3 shadow-xl">
              <div className="text-xs font-bold uppercase tracking-wide text-blue-600">
                {ROUTE_LABELS[selectedRouteIdx]}
              </div>
              <div className="mt-0.5 text-lg font-bold text-slate-900 dark:text-slate-50">
                {selectedRoute.distanceKm} km
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                ~{selectedRoute.durationText} drive
              </div>
            </div>
          )}
        </div>
      </div>
    </DriverDashboardShell>
  );
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function SectionHeading({ icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">{title}</h2>
    </div>
  );
}

function Divider() {
  return <hr className="border-slate-100 dark:border-slate-800" />;
}

function Field({ label, colSpan, required, ...props }) {
  return (
    <label className={`block ${colSpan ? "col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        {...props}
        required={required}
        className="fretron-input glass-input w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:text-slate-100"
      />
    </label>
  );
}
