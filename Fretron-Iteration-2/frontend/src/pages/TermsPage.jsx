import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="mt-4 leading-7 text-slate-600">
          This is a placeholder Terms of Service page. Replace this content later
          with your real legal text.
        </p>
        <div className="mt-6">
          <Link to="/user-signup" className="font-medium text-blue-600 hover:text-blue-700">
            Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}