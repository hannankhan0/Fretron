import { useEffect, useState } from "react";
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
import { apiRequest } from "../../lib/api";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapFlyTo({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location?.lat && location?.lng) {
      map.flyTo([location.lat, location.lng], 15, {
        duration: 0.8,
      });
    }
  }, [location, map]);

  return null;
}

export default function ShipmentLocationMap({
  pickupLocation,
  destinationLocation,
  onPickupChange,
  onDestinationChange,
}) {
  const [pickupQuery, setPickupQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [pickupResults, setPickupResults] = useState([]);
  const [destinationResults, setDestinationResults] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);

  const defaultCenter = { lat: 31.5204, lng: 74.3587 };

  const routeLine =
    pickupLocation && destinationLocation
      ? [
          [pickupLocation.lat, pickupLocation.lng],
          [destinationLocation.lat, destinationLocation.lng],
        ]
      : null;

  async function searchPlaces(query, setResults) {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await apiRequest(`/maps/search?q=${encodeURIComponent(query)}`);
      setResults(res.results || []);
    } catch (error) {
      console.error("Location search failed:", error);
      setResults([]);
    }
  }

  function selectPickup(place) {
    setPickupQuery(place.label);
    setPickupResults([]);
    onPickupChange(place);
    setActiveLocation(place);
  }

  function selectDestination(place) {
    setDestinationQuery(place.label);
    setDestinationResults([]);
    onDestinationChange(place);
    setActiveLocation(place);
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={12}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="bottomright" />

        <MapFlyTo location={activeLocation} />

        {pickupLocation && (
          <Marker
            position={[pickupLocation.lat, pickupLocation.lng]}
            icon={markerIcon}
          >
            <Popup>Pickup: {pickupLocation.label}</Popup>
          </Marker>
        )}

        {destinationLocation && (
          <Marker
            position={[destinationLocation.lat, destinationLocation.lng]}
            icon={markerIcon}
          >
            <Popup>Destination: {destinationLocation.label}</Popup>
          </Marker>
        )}

        {routeLine && (
          <Polyline
            positions={routeLine}
            pathOptions={{ weight: 5 }}
          />
        )}
      </MapContainer>

      <div className="absolute left-8 top-8 z-[1000] w-[430px] max-w-[calc(100%-64px)] rounded-3xl bg-white/95 p-5 shadow-2xl backdrop-blur">
        <div className="mb-4">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
            Post Shipment
          </div>
          <h1 className="mt-1 text-xl font-bold text-slate-950">
            Choose pickup and destination
          </h1>
        </div>

        <div className="space-y-4">
          <SearchInput
            label="Pickup"
            placeholder="Enter pickup location"
            value={pickupQuery}
            selected={pickupLocation}
            results={pickupResults}
            onChange={(value) => {
              setPickupQuery(value);
              searchPlaces(value, setPickupResults);
            }}
            onSelect={selectPickup}
          />

          <SearchInput
            label="Destination"
            placeholder="Where to?"
            value={destinationQuery}
            selected={destinationLocation}
            results={destinationResults}
            onChange={(value) => {
              setDestinationQuery(value);
              searchPlaces(value, setDestinationResults);
            }}
            onSelect={selectDestination}
          />
        </div>

        {pickupLocation && destinationLocation && (
          <button
            type="button"
            className="mt-5 w-full rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
            onClick={() => {
              console.log("Pickup:", pickupLocation);
              console.log("Destination:", destinationLocation);
              alert("Locations confirmed. Next step will ask shipment details.");
            }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function SearchInput({
  label,
  placeholder,
  value,
  selected,
  results,
  onChange,
  onSelect,
}) {
  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      {selected && (
        <p className="mt-1 line-clamp-1 text-xs text-green-700">
          Selected: {selected.label}
        </p>
      )}

      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-[76px] z-[2000] max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-xl">
          {results.map((item, index) => (
            <button
              type="button"
              key={`${item.label}-${index}`}
              onClick={() => onSelect(item)}
              className="block w-full border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50"
            >
              <div className="text-sm font-semibold text-slate-900">
                {item.name || item.label}
              </div>
              <div className="mt-1 line-clamp-2 text-xs text-slate-500">
                {item.label}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}