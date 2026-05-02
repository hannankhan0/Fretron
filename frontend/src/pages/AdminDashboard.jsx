import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import { apiFetch } from '../lib/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await apiFetch('/admin/dashboard');
        setData(response);
      } catch (err) {
        if (/auth|admin|session|unauthorized|forbidden/i.test(err.message)) navigate('/admin/login');
        else setError(err.message);
      }
    })();
  }, [navigate]);

  const stats = data?.stats || {};
  return (
    <AdminLayout title="Admin Dashboard" subtitle="Review pending requests, watch platform growth, and manage approved partners.">
      {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Pending Drivers', stats.pendingDrivers || 0],
          ['Pending Businesses', stats.pendingTransporters || 0],
          ['Total Users', stats.totalUsers || 0],
          ['Active Drivers', stats.activeDrivers || 0],
          ['Active Businesses', stats.activeTransporters || 0],
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Recent Driver Requests</h2>
          <div className="mt-4 space-y-3">
            {(data?.pendingDrivers || []).length === 0 ? <p className="text-sm text-slate-500">No pending driver requests.</p> : null}
            {(data?.pendingDrivers || []).slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <div className="font-medium">{item.full_name}</div>
                  <div className="text-sm text-slate-500">{item.city} • {item.vehicle_type}</div>
                </div>
                <button onClick={() => navigate(`/admin/requests/drivers/${item.id}`)} className="rounded-xl bg-slate-950 px-3 py-2 text-sm text-white">Open</button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Recent Business Requests</h2>
          <div className="mt-4 space-y-3">
            {(data?.pendingTransporters || []).length === 0 ? <p className="text-sm text-slate-500">No pending business requests.</p> : null}
            {(data?.pendingTransporters || []).slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <div className="font-medium">{item.business_name}</div>
                  <div className="text-sm text-slate-500">{item.city} • {item.business_type}</div>
                </div>
                <button onClick={() => navigate(`/admin/requests/transporters/${item.id}`)} className="rounded-xl bg-slate-950 px-3 py-2 text-sm text-white">Open</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
