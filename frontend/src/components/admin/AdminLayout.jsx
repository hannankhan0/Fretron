import { Link, NavLink, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../lib/api';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/requests/drivers', label: 'Driver Requests' },
  { to: '/admin/requests/transporters', label: 'Business Requests' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/drivers', label: 'Active Drivers' },
  { to: '/admin/businesses', label: 'Active Businesses' },
];

export default function AdminLayout({ title, subtitle, children }) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await apiFetch('/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 mesh-gradient page-fade">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 glass-sidebar px-6 py-8 text-white">
          <Link to="/admin" className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 font-semibold">F</div>
            <div>
              <div className="text-lg font-semibold">Fretron Admin</div>
              <div className="text-xs text-slate-300">Control Portal</div>
            </div>
          </Link>

          <nav className="space-y-2">
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  `nav-glow block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-white/90 text-slate-950 shadow-lg shadow-slate-900/20' : 'text-slate-200 hover:bg-white/10'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
          >
            Logout
          </button>
        </aside>

        <main className="px-5 py-6 sm:px-8">
          <div className="mb-6 rounded-3xl glass glass-hover p-6 shadow-sm animate-fade-up">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
