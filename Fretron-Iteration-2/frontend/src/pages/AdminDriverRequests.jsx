import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import { apiFetch } from '../lib/api';

export default function AdminDriverRequests() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await apiFetch('/admin/driver-requests');
        setRows(response.requests || []);
      } catch (err) {
        if (/auth|admin|session|unauthorized|forbidden/i.test(err.message)) navigate('/admin/login');
        else setError(err.message);
      }
    })();
  }, [navigate]);

  return (
    <AdminLayout title="New Driver Requests" subtitle="Pending driver applications waiting for review and approval.">
      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        {error ? <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-medium">Driver</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">City</th>
                <th className="px-6 py-4 font-medium">Vehicle</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No records found.</td></tr>
              ) : rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 align-top">
                  <td className="px-6 py-4 font-medium">{row.full_name}</td>
                  <td className="px-6 py-4 text-slate-600">{row.email}<br />{row.phone || '-'}</td>
                  <td className="px-6 py-4">{row.city}</td>
                  <td className="px-6 py-4">{row.vehicle_type}<br />{row.vehicle_number}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4"><Link className="rounded-xl bg-slate-950 px-3 py-2 text-white" to={`/admin/requests/drivers/${row.id}`}>Open</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
