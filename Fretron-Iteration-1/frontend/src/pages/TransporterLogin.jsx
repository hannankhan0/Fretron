import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function TransporterLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatusMessage("");
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/auth/transporter/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

if (!res.ok) {
  setError(data.message || "Transporter login failed.");
  return;
}

const status = data?.user?.account_status;

if (status !== "approved") {
  if (status === "pending") {
    setError("Your business application is still under review by Fretron admin.");
  } else if (status === "rejected") {
    setError("Your business application was rejected. Please contact admin or resubmit later.");
  } else {
    setError("Your business account is not yet approved.");
  }
  return;
}

navigate("/transporter-dashboard");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_45%,#f8fafc_100%)] text-slate-900">
      <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-10 lg:px-8 lg:py-14">
        <section className="w-full max-w-xl rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">Transporter Portal</div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Transport business login</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">Log in to check your business verification status and access transporter tools after Fretron admin approval.</p>
          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <Field label="Business email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="company@email.com" required />
            <Field label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
            {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {statusMessage && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">{statusMessage}</div>}
            <button type="submit" disabled={loading} className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">{loading ? "Logging In..." : "Log In as Transporter"}</button>
          </form>
          <div className="mt-6 text-sm text-slate-500">Need to apply first? <Link to="/transporter-signup" className="font-medium text-blue-600 hover:text-blue-700">Apply as transporter</Link></div>
        </section>
      </main>
    </div>
  );
}
function Field({ label, ...props }) { return <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{label}</span><input {...props} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>; }
