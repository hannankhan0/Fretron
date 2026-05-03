import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDashboardShell from "./UserDashboardShell";
import ShipmentLocationMap from "../../components/maps/ShipmentLocationMap";
import { apiRequest } from "../../lib/api";
import { useClerkApi } from "../../lib/useClerkApi";

// ── Helpers ────────────────────────────────────────────────────────────────────
function Field({ label, required, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
}

const INPUT_CLS =
  "fretron-input w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500";

const SELECT_CLS = INPUT_CLS;

const PARCEL_CATEGORIES = [
  { value: "general",      label: "General goods" },
  { value: "fragile",      label: "Fragile" },
  { value: "perishable",   label: "Perishable / food" },
  { value: "heavy",        label: "Heavy machinery" },
  { value: "oversized",    label: "Oversized cargo" },
  { value: "electronics",  label: "Electronics" },
  { value: "furniture",    label: "Furniture" },
  { value: "raw_material", label: "Raw materials" },
  { value: "other",        label: "Other" },
];

const URGENCY_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "express",  label: "Express (2–3 days)" },
  { value: "urgent",   label: "Urgent (same / next day)" },
];

// ── Step 1: Shipment details form ─────────────────────────────────────────────
function ShipmentDetailsForm({ mapData, onBack }) {
  const navigate   = useNavigate();
  const apiReady   = useClerkApi();

  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    parcelCategory:        "general",
    urgency:               "standard",
    weightKg:              "",
    dimensions:            "",
    capacityNeeded:        "",
    budget:                "",
    pickupDate:            today,
    preferredDeliveryDate: "",
    handlingNotes:         "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!apiReady) return;
    if (!form.weightKg || isNaN(Number(form.weightKg)) || Number(form.weightKg) <= 0) {
      setError("Please enter a valid weight.");
      return;
    }
    if (!form.pickupDate) {
      setError("Pickup date is required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await apiRequest("/shipments", {
        method: "POST",
        body: JSON.stringify({
          pickupCity:            mapData.pickup.city || mapData.pickup.name,
          destinationCity:       mapData.destination.city || mapData.destination.name,
          pickupLat:             mapData.pickup.lat,
          pickupLng:             mapData.pickup.lng,
          destinationLat:        mapData.destination.lat,
          destinationLng:        mapData.destination.lng,
          parcelCategory:        form.parcelCategory,
          urgency:               form.urgency,
          weightKg:              Number(form.weightKg),
          dimensions:            form.dimensions || null,
          capacityNeeded:        form.capacityNeeded ? Number(form.capacityNeeded) : null,
          budget:                form.budget ? Number(form.budget) : null,
          pickupDate:            form.pickupDate,
          preferredDeliveryDate: form.preferredDeliveryDate || null,
          handlingNotes:         form.handlingNotes || null,
          status:                "published",
        }),
      });

      navigate("/user-dashboard/my-shipments");
    } catch (err) {
      setError(err.message || "Failed to post shipment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <UserDashboardShell>
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onBack}
            className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ← Back to map
          </button>
          <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-600">
            Post Shipment
          </div>
          <h1 className="mt-1 text-2xl font-bold text-slate-950 dark:text-slate-50">
            Shipment details
          </h1>

          {/* Route summary pill */}
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800">
            <span className="font-medium text-green-700 dark:text-green-400">
              {mapData.pickup.name || mapData.pickup.city}
            </span>
            <span className="text-slate-400">→</span>
            <span className="font-medium text-red-700 dark:text-red-400">
              {mapData.destination.name || mapData.destination.city}
            </span>
            {mapData.selectedRoute && (
              <>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {mapData.selectedRoute.distanceKm} km · {mapData.selectedRoute.durationText}
                </span>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Parcel category + urgency */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cargo type" required>
              <select
                className={SELECT_CLS}
                value={form.parcelCategory}
                onChange={(e) => set("parcelCategory", e.target.value)}
                required
              >
                {PARCEL_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Urgency" required>
              <select
                className={SELECT_CLS}
                value={form.urgency}
                onChange={(e) => set("urgency", e.target.value)}
                required
              >
                {URGENCY_OPTIONS.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Weight + dimensions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Weight (kg)" required>
              <input
                type="number"
                className={INPUT_CLS}
                placeholder="e.g. 500"
                min="0.1"
                step="0.1"
                value={form.weightKg}
                onChange={(e) => set("weightKg", e.target.value)}
                required
              />
            </Field>

            <Field label="Dimensions" hint="Optional — e.g. 2m × 1.5m × 1m">
              <input
                type="text"
                className={INPUT_CLS}
                placeholder="L × W × H"
                value={form.dimensions}
                onChange={(e) => set("dimensions", e.target.value)}
              />
            </Field>
          </div>

          {/* Capacity + budget */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Capacity needed (tonnes)" hint="Optional">
              <input
                type="number"
                className={INPUT_CLS}
                placeholder="e.g. 5"
                min="0.1"
                step="0.1"
                value={form.capacityNeeded}
                onChange={(e) => set("capacityNeeded", e.target.value)}
              />
            </Field>

            <Field label="Budget (PKR)" hint="Optional — leave blank if flexible">
              <input
                type="number"
                className={INPUT_CLS}
                placeholder="e.g. 25000"
                min="0"
                step="100"
                value={form.budget}
                onChange={(e) => set("budget", e.target.value)}
              />
            </Field>
          </div>

          {/* Pickup date + preferred delivery date */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pickup date" required>
              <input
                type="date"
                className={INPUT_CLS}
                min={today}
                value={form.pickupDate}
                onChange={(e) => set("pickupDate", e.target.value)}
                required
              />
            </Field>

            <Field label="Preferred delivery date" hint="Optional">
              <input
                type="date"
                className={INPUT_CLS}
                min={form.pickupDate || today}
                value={form.preferredDeliveryDate}
                onChange={(e) => set("preferredDeliveryDate", e.target.value)}
              />
            </Field>
          </div>

          {/* Handling notes */}
          <Field label="Handling instructions" hint="Optional — special requirements, fragility notes, etc.">
            <textarea
              className={`${INPUT_CLS} min-h-[80px] resize-y`}
              placeholder="e.g. Keep upright, temperature-sensitive, do not stack"
              value={form.handlingNotes}
              onChange={(e) => set("handlingNotes", e.target.value)}
              rows={3}
            />
          </Field>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !apiReady}
              className="w-full rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Posting…" : "Post shipment →"}
            </button>
          </div>
        </form>
      </div>
    </UserDashboardShell>
  );
}

// ── Root page — step controller ───────────────────────────────────────────────
export default function PostShipmentPage() {
  const [step, setStep]         = useState(0);          // 0 = map, 1 = form
  const [mapData, setMapData]   = useState(null);        // data from onContinue
  const [pickup, setPickup]     = useState(null);
  const [destination, setDest]  = useState(null);

  function handleContinue(data) {
    setMapData(data);
    setStep(1);
  }

  if (step === 1 && mapData) {
    return <ShipmentDetailsForm mapData={mapData} onBack={() => setStep(0)} />;
  }

  return (
    <UserDashboardShell mapMode>
      <div className="h-full w-full">
        <ShipmentLocationMap
          pickupLocation={pickup}
          destinationLocation={destination}
          onPickupChange={setPickup}
          onDestinationChange={setDest}
          onContinue={handleContinue}
        />
      </div>
    </UserDashboardShell>
  );
}
