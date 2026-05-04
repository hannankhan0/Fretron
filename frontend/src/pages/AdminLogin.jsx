import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/admin/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 mesh-gradient page-fade">
      <div className="pointer-events-none absolute -left-10 top-24 h-48 w-48 rounded-full bg-blue-400/12 blur-3xl animate-orb" />
      <div className="pointer-events-none absolute right-0 top-28 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl animate-orb-alt" />
      <div className="glass glass-shimmer w-full max-w-md rounded-3xl p-8 shadow-xl animate-fade-up">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-semibold text-white">F</div>
          <h1 className="text-2xl font-semibold">Admin Portal</h1>
          <p className="mt-2 text-sm text-slate-600">Sign in with your approved Fretron admin account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="fretron-input glass-input w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-600" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="fretron-input glass-input w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-600" required />
          </div>

          {error ? <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

          <button type="submit" disabled={loading} className="fretron-btn w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">Back to <Link to="/" className="font-medium text-blue-600">Fretron Home</Link></p>
      </div>
    </div>
  );
}
