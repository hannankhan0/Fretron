import { Router } from "express";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/maps/search?q=<query>
//
// Strategy:
//   1. Photon (Komoot) — Elasticsearch-backed OSM geocoder, best for POI/
//      institution searches (e.g. "FAST University Lahore").  Pakistan bbox
//      restricts results to [60.8, 23.6, 77.0, 37.1].
//   2. Nominatim fallback — if Photon returns < 2 results, run Nominatim
//      with countrycodes=pk for city/area precision.
//   Results are merged, de-duplicated, and filtered to Pakistan only.
// ─────────────────────────────────────────────────────────────────────────────

// Pakistan bounding box [west, south, east, north]
const PK_BBOX = "60.8,23.6,77.0,37.1";

function normPhoton(features) {
  return features.map((f) => {
    const p   = f.properties || {};
    const coords = f.geometry?.coordinates || [0, 0]; // [lng, lat]

    const nameParts = [p.name, p.street, p.district, p.city, p.state]
      .filter(Boolean);

    const name  = p.name || p.city || p.district || coords.join(", ");
    const city  = p.city || p.district || p.county || "";
    const state = p.state || "";

    const label = nameParts.slice(0, 4).join(", ") || name;

    return {
      label,
      name,
      city,
      state,
      country: p.country || "Pakistan",
      lat: coords[1],
      lng: coords[0],
      osm_type: p.osm_type || "",
      place_id: `${p.osm_type}_${p.osm_id}`,
    };
  });
}

function normNominatim(items) {
  return items.map((item) => {
    const addr = item.address || {};
    const name =
      item.namedetails?.name ||
      addr.amenity ||
      addr.building ||
      addr.neighbourhood ||
      addr.suburb ||
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      addr.county ||
      item.display_name.split(",")[0].trim();

    const city  = addr.city || addr.town || addr.village || addr.county || "";
    const state = addr.state || addr.state_district || "";

    const label = item.display_name
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4)
      .join(", ");

    return {
      label,
      name,
      city,
      state,
      country: "Pakistan",
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      osm_type: item.osm_type,
      place_id: String(item.place_id),
    };
  });
}

router.get("/search", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();
    if (!q || q.length < 2) return res.json({ success: true, results: [] });

    const UA = "Fretron/1.0 intercity-logistics-platform (contact@fretron.com)";
    const seen = new Set();
    let results = [];

    // ── 1. Photon (primary) ──────────────────────────────────────────────────
    try {
      const photonUrl = new URL("https://photon.komoot.io/api/");
      photonUrl.searchParams.set("q", q);
      photonUrl.searchParams.set("limit", "10");
      photonUrl.searchParams.set("bbox", PK_BBOX);
      photonUrl.searchParams.set("lang", "en");

      const photonRes = await fetch(photonUrl.toString(), {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(4000),
      });

      if (photonRes.ok) {
        const photonData = await photonRes.json();
        const features   = (photonData.features || []).filter((f) => {
          const country = (f.properties?.country || "").toLowerCase();
          return country === "pakistan" || country === "";
        });

        results = normPhoton(features);
        results.forEach((r) => seen.add(r.place_id));
      }
    } catch { /* Photon timeout or unreachable — fall through */ }

    // ── 2. Nominatim fallback / supplement ───────────────────────────────────
    if (results.length < 3) {
      try {
        const nomUrl = new URL("https://nominatim.openstreetmap.org/search");
        nomUrl.searchParams.set("q", q);
        nomUrl.searchParams.set("format", "json");
        nomUrl.searchParams.set("limit", "8");
        nomUrl.searchParams.set("countrycodes", "pk");
        nomUrl.searchParams.set("addressdetails", "1");
        nomUrl.searchParams.set("namedetails", "1");
        nomUrl.searchParams.set("dedupe", "1");
        nomUrl.searchParams.set("accept-language", "en");

        const nomRes = await fetch(nomUrl.toString(), {
          headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
          signal: AbortSignal.timeout(5000),
        });

        if (nomRes.ok) {
          const nomData = await nomRes.json();
          const extra   = normNominatim(nomData).filter(
            (r) => !seen.has(r.place_id)
          );
          results = [...results, ...extra];
        }
      } catch { /* Nominatim unreachable */ }
    }

    // Trim to 8 unique results
    results = results.slice(0, 8);
    return res.json({ success: true, results });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/maps/route?originLat=&originLng=&destLat=&destLng=&waypoints=
// Proxies OSRM to compute real road routes with alternatives
// waypoints format: "lat1,lng1;lat2,lng2" (semicolon-separated pairs)
// Returns up to 3 route alternatives with GeoJSON geometry, distance, duration
// ─────────────────────────────────────────────────────────────────────────────
router.get("/route", async (req, res, next) => {
  try {
    const { originLat, originLng, destLat, destLng, waypoints } = req.query;

    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({
        success: false,
        message: "originLat, originLng, destLat, destLng are all required",
      });
    }

    // Build OSRM coordinate string – OSRM uses [lng,lat] (GeoJSON) order
    const coordParts = [
      `${parseFloat(originLng).toFixed(6)},${parseFloat(originLat).toFixed(6)}`,
    ];

    // Insert custom waypoints between origin and destination
    if (waypoints) {
      for (const wp of waypoints.split(";").filter(Boolean)) {
        const [wpLat, wpLng] = wp.split(",").map(Number);
        if (!isNaN(wpLat) && !isNaN(wpLng)) {
          coordParts.push(`${wpLng.toFixed(6)},${wpLat.toFixed(6)}`);
        }
      }
    }

    coordParts.push(
      `${parseFloat(destLng).toFixed(6)},${parseFloat(destLat).toFixed(6)}`
    );

    const coordStr = coordParts.join(";");

    // OSRM public API – full geometry, up to 3 route alternatives
    const osrmUrl =
      `https://router.project-osrm.org/route/v1/driving/${coordStr}` +
      `?overview=full&geometries=geojson&alternatives=true&steps=false`;

    const response = await fetch(osrmUrl, {
      headers: { "User-Agent": "Fretron/1.0" },
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Routing service failed – please try again",
      });
    }

    const data = await response.json();

    if (data.code !== "Ok" || !data.routes?.length) {
      return res.status(404).json({
        success: false,
        message: "No route found between these locations",
      });
    }

    const routes = data.routes.map((route, index) => {
      const totalSecs = Math.round(route.duration);
      const hours = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);

      return {
        index,
        geometry: route.geometry, // GeoJSON LineString – coordinates are [lng,lat]
        distanceM: Math.round(route.distance),
        durationS: totalSecs,
        distanceKm: (route.distance / 1000).toFixed(1),
        durationText: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`,
      };
    });

    return res.json({ success: true, routes });
  } catch (error) {
    next(error);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/maps/reverse?lat=&lng=
// Reverse geocode a lat/lng to a Pakistani address via Nominatim
// ─────────────────────────────────────────────────────────────────────────────
router.get("/reverse", async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: "lat and lng are required numbers" });
    }

    const url = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("lat", lat.toFixed(6));
    url.searchParams.set("lon", lng.toFixed(6));
    url.searchParams.set("format", "json");
    url.searchParams.set("zoom", "14");        // neighbourhood level
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("accept-language", "en");

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "Fretron/1.0 intercity-logistics-platform (contact@fretron.com)",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      return res.status(502).json({ success: false, message: "Reverse geocoding service unavailable" });
    }

    const data = await response.json();

    if (data.error) {
      return res.status(404).json({ success: false, message: "No location found at these coordinates" });
    }

    const addr = data.address || {};
    const name =
      addr.neighbourhood ||
      addr.suburb ||
      addr.city_district ||
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      data.display_name?.split(",")[0]?.trim() ||
      "Current location";

    const city = addr.city || addr.town || addr.village || addr.county || "";
    const state = addr.state || addr.state_district || "";

    const labelParts = data.display_name
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4) || [];

    const place = {
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      name,
      city,
      state,
      country: addr.country || "Pakistan",
      label: labelParts.join(", "),
      place_id: data.place_id,
    };

    return res.json({ success: true, place });
  } catch (error) {
    next(error);
  }
});

export default router;
