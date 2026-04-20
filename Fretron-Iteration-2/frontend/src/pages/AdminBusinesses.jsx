import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/admin/AdminLayout";
import { apiRequest } from "../lib/api";

export default function AdminBusinesses() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const response = await apiRequest("/admin/transporters");
        setRows(response.transporters || []);
      } catch (err) {
        const message = err?.message || "Failed to load businesses";

        if (/auth|admin|session|unauthorized|forbidden/i.test(message)) {
          navigate("/admin/login");
        } else {
          setError(message);
        }
      }
    };

    loadBusinesses();
  }, [navigate]);

  return (
    <AdminLayout
      title="Active Businesses"
      subtitle="Approved transport companies and business partners."
    >
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        {error ? (
          <div className="border-b border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-medium">Business</th>
                <th className="px-6 py-4 font-medium">Owner</th>
                <th className="px-6 py-4 font-medium">City</th>
                <th className="px-6 py-4 font-medium">Fleet</th>
                <th className="px-6 py-4 font-medium">Approved</th>
                <th className="px-6 py-4 font-medium">Last Login</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No records found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-200 align-top">
                    <td className="px-6 py-4 font-medium">{row.business_name}</td>
                    <td className="px-6 py-4 text-slate-600">{row.owner_name}</td>
                    <td className="px-6 py-4">{row.city}</td>
                    <td className="px-6 py-4">{row.fleet_size}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {row.reviewed_at
                        ? new Date(row.reviewed_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {row.last_login_at
                        ? new Date(row.last_login_at).toLocaleString()
                        : "Never"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}