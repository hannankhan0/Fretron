import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import { apiFetch } from '../lib/api';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const response = await apiFetch('/admin/users');
        setRows(response.users || []);
      } catch (err) {
        if (/auth|admin|session|unauthorized|forbidden/i.test(err.message)) navigate('/admin/login');
        else setError(err.message);
      }
    })();
  }, [navigate]);

  return (
    <AdminLayout title="All Users" subtitle="View all user accounts, roles, status, and last login activity.">
      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        {error ? <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Login</th>
                <th className="px-6 py-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No records found.</td></tr>
              ) : rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 align-top">
                  <td className="px-6 py-4 font-medium">{row.full_name}{row.business_name ? <div className="text-xs text-slate-500">{row.business_name}</div> : null}</td>
                  <td className="px-6 py-4 text-slate-600">{row.email}<br />{row.phone || '-'}</td>
                  <td className="px-6 py-4 uppercase">{row.role}</td>
                  <td className="px-6 py-4">{row.account_status}</td>
                  <td className="px-6 py-4 text-slate-600">{row.last_login_at ? new Date(row.last_login_at).toLocaleString() : 'Never'}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(row.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
