import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DriverDashboardShell from "./DriverDashboardShell";
import { apiRequest } from "../../lib/api";

const initialForm = {
  originCity: "",
  destinationCity: "",
  departureDatetime: "",
  estimatedArrival: "",
  availableCapacityKg: "",
  vehicleType: "",
  pricingModel: "",
  priceAmount: "",
  restrictions: "",
  operationalNotes: "",
  status: "published",
};

export default function PostRoutePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await apiRequest("/routes", {
        method: "POST",
        body: JSON.stringify(form),
      });
      navigate("/driver-dashboard/route-posts");
    } catch (err) {
      setError(err.message || "Failed to create route");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DriverDashboardShell
      title="Post route and available capacity"
      subtitle="Publish a live route so users can request it or you can offer it on shipments."
    >
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Origin city" name="originCity" value={form.originCity} onChange={handleChange} required />
            <Field label="Destination city" name="destinationCity" value={form.destinationCity} onChange={handleChange} required />
            <Field label="Departure date and time" type="datetime-local" name="departureDatetime" value={form.departureDatetime} onChange={handleChange} required />
            <Field label="Estimated arrival" type="datetime-local" name="estimatedArrival" value={form.estimatedArrival} onChange={handleChange} />
            <Field label="Available capacity (kg)" type="number" name="availableCapacityKg" value={form.availableCapacityKg} onChange={handleChange} required />
            <Field label="Vehicle type" name="vehicleType" value={form.vehicleType} onChange={handleChange} required />
            <Field label="Pricing model" name="pricingModel" value={form.pricingModel} onChange={handleChange} required />
            <Field label="Price amount" type="number" name="priceAmount" value={form.priceAmount} onChange={handleChange} />
            <Field label="Restrictions" name="restrictions" value={form.restrictions} onChange={handleChange} />
            <label className="md:col-span-2 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Operational notes</span>
              <textarea
                name="operationalNotes"
                rows="4"
                value={form.operationalNotes}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          {error && <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="mt-6 flex gap-3">
            <button type="submit" disabled={loading} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white">
              {loading ? "Publishing..." : "Publish Route"}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Checklist</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Add exact origin and destination.</li>
            <li>• Use real free capacity, not total vehicle size.</li>
            <li>• Mention restrictions clearly.</li>
            <li>• Add timing so users trust the listing.</li>
          </ul>
        </div>
      </section>
    </DriverDashboardShell>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input {...props} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
    </label>
  );
}