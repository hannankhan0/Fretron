import UserDashboardShell from "./UserDashboardShell";

export default function PostShipmentPage() {
  return (
    <UserDashboardShell
      title="Post shipment request"
      subtitle="Publish demand into the marketplace so drivers and transport providers can respond based on timing, route, and cargo fit."
      actions={<button className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Save Draft</button>}
    >
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["Pickup city", "Karachi"],
              ["Destination city", "Lahore"],
              ["Pickup date", "24 Mar 2026"],
              ["Preferred delivery", "25 Mar 2026"],
              ["Parcel category", "Electronics"],
              ["Urgency", "High"],
              ["Weight", "180 kg"],
              ["Dimensions", "48 x 32 x 28 inches"],
              ["Capacity needed", "0.35 ton"],
              ["Budget (optional)", "PKR 18,000"],
            ].map(([label, placeholder]) => (
              <label key={label} className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
                <input
                  type="text"
                  placeholder={placeholder}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            ))}
            <label className="md:col-span-2 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Handling notes</span>
              <textarea rows="5" placeholder="Fragile cargo, keep dry, pickup requires loading assistance..." className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Publish Shipment</button>
            <button type="button" className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">Save as Draft</button>
          </div>
        </form>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Posting guidance</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
              <li>• Mention exact pickup and destination city for better route matching.</li>
              <li>• Add realistic weight and dimensions so capacity calculations stay accurate.</li>
              <li>• Optional budget improves match quality but should stay competitive.</li>
              <li>• Fragile, temperature-sensitive, or sealed cargo notes reduce disputes later.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50 p-6 shadow-sm shadow-blue-100/80">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">What happens next?</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <p>1. Shipment post goes live inside the marketplace.</p>
              <p>2. Matching drivers see the request in their browse shipments view.</p>
              <p>3. You can also search routes manually and book capacity yourself.</p>
              <p>4. Once a booking is confirmed, this request moves into active bookings.</p>
            </div>
          </div>
        </div>
      </section>
    </UserDashboardShell>
  );
}
