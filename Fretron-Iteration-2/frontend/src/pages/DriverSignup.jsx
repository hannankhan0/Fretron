import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const steps = [
  "Account",
  "Identity",
  "Vehicle",
  "Documents",
  "Review",
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  cnic: "",
  city: "",
  address: "",
  licenseNumber: "",
  licenseExpiry: "",
  vehicleType: "",
  vehicleModel: "",
  vehicleNumber: "",
  vehicleCapacityKg: "",
};

export default function DriverSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialForm);
  const [files, setFiles] = useState({
    profilePicture: null,
    cnicFront: null,
    cnicBack: null,
    licenseImage: null,
    vehicleDocument: null,
  });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const progress = useMemo(() => `${((step + 1) / steps.length) * 100}%`, [step]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const { name, files: incomingFiles } = e.target;
    setFiles((prev) => ({ ...prev, [name]: incomingFiles?.[0] || null }));
  }

  function validateStep() {
    if (step === 0) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        return "Please complete all account fields.";
      }
      if (formData.password.length < 6) return "Password must be at least 6 characters.";
      if (formData.password !== formData.confirmPassword) return "Passwords do not match.";
    }

    if (step === 1) {
      if (!formData.cnic || !formData.city || !formData.address || !formData.licenseNumber || !formData.licenseExpiry) {
        return "Please complete identity and license details.";
      }
    }

    if (step === 2) {
      if (!formData.vehicleType || !formData.vehicleModel || !formData.vehicleNumber || !formData.vehicleCapacityKg) {
        return "Please complete vehicle details.";
      }
    }

    if (step === 3) {
      if (!files.profilePicture || !files.cnicFront || !files.cnicBack || !files.licenseImage || !files.vehicleDocument) {
        return "Please upload all required documents.";
      }
    }

    if (step === 4 && !agree) {
      return "Please accept Terms of Service and Privacy Policy.";
    }

    return "";
  }

  function nextStep() {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  }

  function prevStep() {
    setError("");
    setStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      Object.entries(files).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });

      const res = await fetch(`${API_BASE_URL}/applications/drivers/apply`, {
        method: "POST",
        credentials: "include",
        body: payload,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Driver application failed.");
        return;
      }

      setSuccess(data.message || "Driver application submitted successfully.");
      setTimeout(() => navigate("/driver-login"), 1200);
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" required />
            <Field label="Phone number" name="phone" value={formData.phone} onChange={handleChange} placeholder="03xx-xxxxxxx" required />
            <Field label="Email address" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="driver@email.com" required />
            <Field label="Password" name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Create password" required />
            <div className="sm:col-span-2">
              <Field label="Confirm password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="Repeat password" required />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="CNIC number" name="cnic" value={formData.cnic} onChange={handleChange} placeholder="35202-1234567-1" required />
            <Field label="City" name="city" value={formData.city} onChange={handleChange} placeholder="Lahore" required />
            <Field label="License number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="DL-987654" required />
            <Field label="License expiry" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleChange} type="date" required />
            <div className="sm:col-span-2">
              <Field label="Current address" name="address" value={formData.address} onChange={handleChange} placeholder="Street, area, city" required />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField label="Vehicle type" name="vehicleType" value={formData.vehicleType} onChange={handleChange} required options={["Motorbike", "Loader Rickshaw", "Pickup", "Mini Truck", "Truck", "Trailer"]} />
            <Field label="Vehicle model" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} placeholder="Suzuki Ravi / Hino / etc." required />
            <Field label="Vehicle number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} placeholder="LEA-1234" required />
            <Field label="Capacity (kg)" name="vehicleCapacityKg" value={formData.vehicleCapacityKg} onChange={handleChange} type="number" placeholder="500" required />
          </div>
        );
      case 3:
        return (
          <div className="grid gap-5 sm:grid-cols-2">
            <FileField label="Profile picture" name="profilePicture" onChange={handleFileChange} />
            <FileField label="CNIC front image" name="cnicFront" onChange={handleFileChange} />
            <FileField label="CNIC back image" name="cnicBack" onChange={handleFileChange} />
            <FileField label="Driver license image" name="licenseImage" onChange={handleFileChange} />
            <div className="sm:col-span-2">
              <FileField label="Vehicle registration copy" name="vehicleDocument" onChange={handleFileChange} />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
              <div className="grid gap-3 sm:grid-cols-2">
                <Summary label="Name" value={formData.fullName} />
                <Summary label="Email" value={formData.email} />
                <Summary label="Phone" value={formData.phone} />
                <Summary label="City" value={formData.city} />
                <Summary label="CNIC" value={formData.cnic} />
                <Summary label="License" value={formData.licenseNumber} />
                <Summary label="Vehicle" value={`${formData.vehicleType} • ${formData.vehicleNumber}`} />
                <Summary label="Capacity" value={`${formData.vehicleCapacityKg} kg`} />
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>
                I confirm that my information is correct and I agree to the <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-700">Terms of Service</Link> and <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-700">Privacy Policy</Link>.
              </span>
            </label>
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_45%,#f8fafc_100%)] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white shadow-sm">F</div>
            <div>
              <div className="text-lg font-semibold tracking-tight">Fretron</div>
              <div className="text-xs text-slate-500">Driver Enrollment</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/driver-login" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Already a driver?</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
        <section className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">Driver Application</div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Apply as a driver partner</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">Submit your details step by step. Fretron admin will verify your application before activating your driver account.</p>

          <div className="mt-8">
            <div className="mb-5 flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              <span>Step {step + 1} of {steps.length}</span>
              <span>{steps[step]}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: progress }} />
            </div>
          </div>

          <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
            {renderStep()}

            {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {success && <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
              <button type="button" onClick={prevStep} disabled={step === 0 || loading} className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">Back</button>
              {step < steps.length - 1 ? (
                <button type="button" onClick={nextStep} className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Continue</button>
              ) : (
                <button type="submit" disabled={loading} className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">{loading ? "Submitting Application..." : "Submit Driver Application"}</button>
              )}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input {...props} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
    </label>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <select {...props} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
        <option value="">Select an option</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function FileField({ label, name, onChange }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input type="file" name={name} onChange={onChange} accept="image/*,.pdf" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
    </label>
  );
}

function Summary({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-1 font-medium text-slate-900">{value || "—"}</div>
    </div>
  );
}
