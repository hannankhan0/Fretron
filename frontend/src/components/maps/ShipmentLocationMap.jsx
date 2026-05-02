import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  ZoomControl,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { apiRequest } from "../../lib/api";
import LocationSearchInput from "./LocationSearchInput";

// ── Marker icons ─────────────────────────────────────────────────────────────
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

const pickupIcon      = makeDivIcon("#16a34a", "A"); // green
const destinationIcon = makeDivIcon("#dc2626", "B"); // red
const waypointIcon    = (n) => makeDivIcon("#ea580c", n + 1); // orange numbered

// ── Route visual config ───────────────────────────────────────────────────────
const ROUTE_COLORS = ["#2563eb", "#f97316", "#7c3aed"];
const ROUTE_LABELS = ["Fastest route", "Alternative 1", "Alternative 2"];

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

function MapClickHandler({ enabled, onMapClick }) {
  useMapEvents({
    click(e) {
      if (enabled) onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

// ── Main component ────────────────────────────────────────────────────────────
/**
 * ShipmentLocationMap
 * Full-screen map for users posting shipments.
 * - Pakistan-only autocomplete (Nominatim countrycodes=pk)
 * - Real OSRM road routing with up to 3 alternatives
 * - Custom intermediate waypoints via map click
 * - onContinue({ pickup, destination, waypoints, selectedRoute })
 */
export default function ShipmentLocationMap({
  pickupLocation,
  destinationLocation,
  onPickupChange,
  onDestinationChange,
  onContinue,
}) {
  const [routes, setRoutes]                 = useState([]);
  const [selectedIdx, setSelectedIdx]       = useState(0);
  const [waypoints, setWaypoints]           = useState([]);
  const [addingWaypoint, setAddingWaypoint] = useState(false);
  const [loadingRoute, setLoadingRoute]     = useState(false);
  const [routeError, setRouteError]         = useState("");
  const routeTimer                          = useRef(null);

  // Auto-fetch route when both locations or waypoints change
  useEffect(() => {
    if (!pickupLocation || !destinationLocation) {
      setRoutes([]);
      setRouteError("");
      return;
    }
    clearTimeout(routeTimer.current);
    routeTimer.current = setTimeout(fetchRoutes, 400);
    return () => clearTimeout(routeTimer.current);
  }, [pickupLocation, destinationLocation, waypoints]);

  async function fetchRoutes() {
    try {
      setLoadingRoute(true);
      setRouteError("");
      const params = new URLSearchParams({
        originLat: pickupLocation.lat,
        originLng: pickupLocation.lng,
        destLat:   destinationLocation.lat,
        destLng:   destinationLocation.lng,
      });
      if (waypoints.length) {
        params.set("waypoints", waypoints.map((w) => `${w.lat},${w.lng}`).join(";"));
      }
      const res = await apiRequest(`/maps/route?${params}`);
      setRoutes(res.routes || []);
      setSelectedIdx(0);
    } catch {
      setRouteError("Could not calculate route. Try different locations.");
      setRoutes([]);
    } finally {
      setLoadingRoute(false);
    }
  }

  function addWaypoint(latlng) {
    setWaypoints((prev) => [...prev, latlng]);
    setAddingWaypoint(false);
  }

  function removeWaypoint(i) {
    setWaypoints((prev) => prev.filter((_, idx) => idx !== i));
  }

  // OSRM returns [lng, lat]; Leaflet needs [lat, lng]
  const selectedRoute  = routes[selectedIdx];
  const routePositions = selectedRoute
    ? selectedRoute.geometry.coordinates.map(([lng, lat]) => [lat, lng])
    : null;

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      style={{ cursor: addingWaypoint ? "crosshair" : "default" }}
    >
      {/* ── Leaflet map ── */}
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
        <MapClickHandler enabled={addingWaypoint} onMapClick={addWaypoint} />

        {/* Non-selected alternatives – drawn first (behind) */}
        {routes.map((route, i) => {
          if (i === selectedIdx) return null;
          return (
            <Polyline
              key={i}
              positions={route.geometry.coordinates.map(([lng, lat]) => [lat, lng])}
              pathOptions={{ color: "#94a3b8", weight: 4, opacity: 0.45, dashArray: "8,6" }}
            />
          );
        })}

        {/* Selected route on top */}
        {routePositions && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: ROUTE_COLORS[0], weight: 6, opacity: 0.9 }}
          />
        )}

        {/* Pickup marker */}
        {pickupLocation && (
          <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
            <Popup><strong>Pickup</strong><br />{pickupLocation.label}</Popup>
          </Marker>
        )}

        {/* Destination marker */}
        {destinationLocation && (
          <Marker position={[destinationLocation.lat, destinationLocation.lng]} icon={destinationIcon}>
            <Popup><strong>Destination</strong><br />{destinationLocation.label}</Popup>
          </Marker>
        )}

        {/* Waypoint markers */}
        {waypoints.map((wp, i) => (
          <Marker key={i} position={[wp.lat, wp.lng]} icon={waypointIcon(i)}>
            <Popup>
              <strong>Stop {i + 1}</strong><br />
              <button className="mt-1 text-xs text-red-600 underline" onClick={() => removeWaypoint(i)}>
                Remove
              </button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ── Left overlay panel ── */}
      <div className="absolute left-5 top-5 z-[1000] flex w-[390px] max-w-[calc(100vw-40px)] flex-col rounded-3xl bg-white/96 shadow-2xl backdrop-blur-sm">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
          <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-600">
            Post Shipment
          </div>
          <h1 className="mt-1.5 text-xl font-bold text-slate-950">Choose your route</h1>
          <p className="mt-1 text-xs text-slate-500">Search Pakistani cities. Routes calculate automatically.</p>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-4 space-y-4 max-h-[calc(100vh-230px)]">

          <LocationSearchInput
            label="📍 Pickup location"
            placeholder="City, district or area in Pakistan…"
            selectedName={pickupLocation?.name || ""}
            selected={pickupLocation}
            onSelect={onPickupChange}
            onClear={() => onPickupChange(null)}
          />

          <LocationSearchInput
            label="🏁 Destination"
            placeholder="Where should the shipment go?"
            selectedName={destinationLocation?.name || ""}
            selected={destinationLocation}
            onSelect={onDestinationChange}
            onClear={() => onDestinationChange(null)}
          />

          {/* Custom waypoints */}
          {pickupLocation && destinationLocation && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Custom stops
                  {waypoints.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                      {waypoints.length}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  {waypoints.length > 0 && (
                    <button type="button" onClick={() => setWaypoints([])} className="text-xs text-red-500 hover:underline">
                      Clear all
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setAddingWaypoint((v) => !v)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                      addingWaypoint
                        ? "bg-orange-500 text-white ring-2 ring-orange-300"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {addingWaypoint ? "📌 Click map…" : "+ Add stop"}
                  </button>
                </div>
              </div>

              {waypoints.length > 0 && (
                <ul className="mt-2 space-y-1.5">
                  {waypoints.map((wp, i) => (
                    <li key={i} className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-xs">
                      <span className="font-semibold text-orange-800">Stop {i + 1}</span>
                      <span className="mx-2 text-slate-500">{wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}</span>
                      <button type="button" onClick={() => removeWaypoint(i)} className="text-base font-bold leading-none text-red-400 hover:text-red-600">×</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Route loading / error */}
          {loadingRoute && (
            <div className="flex items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
              <svg className="h-4 w-4 animate-spin flex-none" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Calculating road routes…
            </div>
          )}
          {routeError && !loadingRoute && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{routeError}</div>
          )}

          {/* Route alternatives */}
          {routes.length > 0 && !loadingRoute && (
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Route options
              </div>
              <div className="space-y-2">
                {routes.map((route, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedIdx(i)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      selectedIdx === i
                        ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100/60"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 flex-none rounded-full" style={{ background: ROUTE_COLORS[i] ?? "#6b7280" }} />
                        <span className="text-sm font-semibold text-slate-800">
                          {ROUTE_LABELS[i] ?? `Route ${i + 1}`}
                        </span>
                      </div>
                      {selectedIdx === i && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {route.distanceKm} km &nbsp;·&nbsp; ~{route.durationText}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Continue button */}
        {pickupLocation && destinationLocation && (
          <div className="px-6 pb-5 pt-2">
            <button
              type="button"
              onClick={() =>
                onContinue?.({
                  pickup:        pickupLocation,
                  destination:   destinationLocation,
                  waypoints,
                  selectedRoute: routes[selectedIdx] ?? null,
                })
              }
              className="w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Continue →
            </button>
          </div>
        )}
      </div>

      {/* Waypoint crosshair toast */}
      {addingWaypoint && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-[1000] -translate-x-1/2 rounded-2xl bg-orange-600/95 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          📌 Click anywhere on the map to add a stop
        </div>
      )}
    </div>
  );
}
