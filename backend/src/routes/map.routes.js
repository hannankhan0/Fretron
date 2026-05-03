import { Router } from "express";

const router = Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/maps/search?q=<query>
// Uses Nominatim (OpenStreetMap) restricted to Pakistan (countrycodes=pk)
// Replaces Photon which had poor Pakistan coverage
// ─────────────────────────────────────────────────────────────────────────────
router.get("/search", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q || q.length < 2) {
      return res.json({ success: true, results: [] });
    }

    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", q);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "8");
    url.searchParams.set("countrycodes", "pk"); // Pakistan only
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("dedupe", "1");
    url.searchParams.set("accept-language", "en");

    const response = await fetch(url.toString(), {
      headers: {
        // Nominatim requires a descriptive User-Agent per usage policy
        "User-Agent": "Fretron/1.0 intercity-logistics-platform (contact@fretron.com)",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Location search service unavailable",
      });
    }

    const data = await response.json();

    const results = data.map((item) => {
      const addr = item.address || {};

      // Best human-readable name for Pakistani locations
      const name =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.county ||
        item.display_name.split(",")[0].trim();

      const city =
        addr.city || addr.town || addr.village || addr.county || "";

      const state = addr.state || addr.state_district || "";

      // Concise label: first 4 parts of Nominatim's display_name
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
        place_id: item.place_id,
      };
    });

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
