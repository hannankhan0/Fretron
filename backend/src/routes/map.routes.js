import { Router } from "express";

const router = Router();

router.get("/search", async (req, res, next) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.json({
        success: true,
        results: [],
      });
    }

    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
      q
    )}&limit=8`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Map search service failed",
      });
    }

    const data = await response.json();

    const results = (data.features || []).map((item) => {
      const props = item.properties || {};
      const coordinates = item.geometry?.coordinates || [];

      const lng = coordinates[0];
      const lat = coordinates[1];

      const label = [
        props.name,
        props.street,
        props.city,
        props.state,
        props.country,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        label: label || `${lat}, ${lng}`,
        name: props.name || "",
        street: props.street || "",
        city: props.city || props.state || "",
        country: props.country || "",
        lat,
        lng,
      };
    });

    return res.json({
      success: true,
      results,
    });
  } catch (error) {
    next(error);
  }
});

export default router;