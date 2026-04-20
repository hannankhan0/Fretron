import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserDashboardShell from "./UserDashboardShell";
import { apiRequest } from "../../lib/api";

const initialForm = {
  pickupCity: "",
  destinationCity: "",
  pickupDate: "",
  preferredDeliveryDate: "",
  parcelCategory: "",
  urgency: "",
  weightKg: "",
  dimensions: "",
  capacityNeeded: "",
  budget: "",
  handlingNotes: "",
  status: "published",
};

export default function PostShipmentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await apiRequest("/shipments", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setSuccess("Shipment created successfully.");
      setTimeout(() => navigate("/user-dashboard/shipment-posts"), 700);
    } catch (err) {
      setError(err.message || "Failed to create shipment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserDashboardShell
      title="Post shipment request"
      subtitle="Publish shipment demand so drivers can find and book it."
    >
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Pickup city" name="pickupCity" value={form.pickupCity} onChange={handleChange} required />
            <Field label="Destination city" name="destinationCity" value={form.destinationCity} onChange={handleChange} required />
            <Field label="Pickup date" name="pickupDate" type="date" value={form.pickupDate} onChange={handleChange} required />
            <Field label="Preferred delivery date" name="preferredDeliveryDate" type="date" value={form.preferredDeliveryDate} onChange={handleChange} />
            <Field label="Parcel category" name="parcelCategory" value={form.parcelCategory} onChange={handleChange} required />
            <SelectField label="Urgency" name="urgency" value={form.urgency} onChange={handleChange} required options={["Low", "Normal", "High", "Urgent"]} />
            <Field label="Weight (kg)" name="weightKg" type="number" value={form.weightKg} onChange={handleChange} required />
            <Field label="Dimensions" name="dimensions" value={form.dimensions} onChange={handleChange} />
            <Field label="Capacity needed" name="capacityNeeded" value={form.capacityNeeded} onChange={handleChange} />
            <Field label="Budget" name="budget" type="number" value={form.budget} onChange={handleChange} />
            <label className="md:col-span-2 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Handling notes</span>
              <textarea
                name="handlingNotes"
                rows="4"
                value={form.handlingNotes}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>

          {error && <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {success && <div className="mt-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={loading} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white">
              {loading ? "Publishing..." : "Publish Shipment"}
            </button>
          </div>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">What happens next?</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>1. Your shipment goes live in the marketplace.</p>
            <p>2. Drivers can send offers on it.</p>
            <p>3. You can also browse routes and request a driver yourself.</p>
            <p>4. After acceptance, the booking moves into active bookings.</p>
          </div>
        </div>
      </section>
    </UserDashboardShell>
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

function SelectField({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <select {...props} className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
        <option value="">Select</option>
        {options.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}