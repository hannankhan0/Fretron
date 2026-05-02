import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import { apiFetch, fileUrl } from '../lib/api';

function DocCard({ label, src }) {
  if (!src) return <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">{label}: not uploaded</div>;
  const url = fileUrl(src);
  const isPdf = /\.pdf$/i.test(src);
  return (
    <a href={url} target="_blank" rel="noreferrer" className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md">
      <div className="mb-3 text-sm font-medium text-slate-700">{label}</div>
      {isPdf ? <div className="rounded-xl bg-slate-100 p-8 text-center text-slate-600">Open PDF</div> : <img src={url} alt={label} className="h-48 w-full rounded-xl object-cover" />}
    </a>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-medium text-slate-900">{value || '-'}</div>
    </div>
  );
}

export default function AdminTransporterRequestDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await apiFetch(`/admin/transporter-requests/${id}`);
        setRequest(response.request);
      } catch (err) {
        if (/auth|admin|session|unauthorized|forbidden/i.test(err.message)) navigate('/admin/login');
        else setError(err.message);
      }
    })();
  }, [id, navigate]);

  async function handleAction(action) {
    const reason = action === 'reject' ? window.prompt('Enter rejection reason (optional):', '') || '' : '';
    setActionLoading(true);
    setError('');
    try {
      await apiFetch(`/admin/transporter-requests/${id}/${action}`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
      navigate('/admin/requests/transporters');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <AdminLayout title="Business Request Detail" subtitle="Review the submitted business details and proofs before activating the transporter account.">
      <div className="mb-4"><Link to="/admin/requests/transporters" className="text-sm font-medium text-blue-600">← Back to business requests</Link></div>
      {error ? <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}
      {!request ? <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">Loading...</div> : (
        <>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="grid gap-4 md:grid-cols-2">
                <Info label="Business Name" value={request.business_name} />
                <Info label="Owner Name" value={request.owner_name} />
                <Info label="Email" value={request.email} />
                <Info label="Phone" value={request.phone} />
                <Info label="Registration Number" value={request.registration_number} />
                <Info label="Business Type" value={request.business_type} />
                <Info label="City" value={request.city} />
                <Info label="Address" value={request.address} />
                <Info label="Fleet Size" value={request.fleet_size} />
                <Info label="Service Areas" value={request.service_areas} />
                <Info label="Own Drivers" value={request.has_own_drivers ? 'Yes' : 'No'} />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm text-slate-500">Current Status</div>
              <div className="mt-2 text-2xl font-semibold uppercase tracking-tight">{request.verification_status}</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button disabled={actionLoading} onClick={() => handleAction('approve')} className="rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white">Approve</button>
                <button disabled={actionLoading} onClick={() => handleAction('reject')} className="rounded-xl bg-red-600 px-4 py-3 font-medium text-white">Reject</button>
              </div>
              {request.rejection_reason ? <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">Rejection reason: {request.rejection_reason}</div> : null}
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <DocCard label="Company Logo" src={request.company_logo_url} />
            <DocCard label="Owner CNIC Front" src={request.owner_cnic_front_url} />
            <DocCard label="Owner CNIC Back" src={request.owner_cnic_back_url} />
            <DocCard label="Registration Document" src={request.registration_document_url} />
          </div>
        </>
      )}
    </AdminLayout>
  );
}
