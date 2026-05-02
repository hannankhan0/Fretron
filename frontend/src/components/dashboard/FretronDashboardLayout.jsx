import { NavLink, useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";
import { useTheme } from "../../lib/useTheme";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function FretronDashboardLayout({
  title,
  subtitle,
  badge,
  navItems = [],
  actions,
  children,
  hideHeader = false,
  contentFull = false,
}) {
  const navigate = useNavigate();
  const [isDark, toggleDark] = useTheme();

  async function handleLogout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // ignore logout error, still redirect
    } finally {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="relative z-[3000] border-r border-slate-200 bg-slate-950 px-5 py-6 text-white">
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left transition hover:bg-white/10"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold shadow-lg shadow-blue-700/30">
              F
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight">
                Fretron
              </div>
              <div className="text-xs text-slate-400">
                Hyperlocal Logistics Exchange
              </div>
            </div>
          </button>

          <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-slate-800/40 p-4">
            <div className="text-xs uppercase tracking-[0.24em] text-blue-200/90">
              Portal
            </div>
            <div className="mt-2 text-xl font-semibold">
              {badge || "Dashboard"}
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Manage logistics activity, monitor live requests, and keep your
              side of the marketplace organized.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  classNames(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="relative min-w-0 overflow-hidden">
          {!hideHeader && (
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
              <div className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-10">
                <div>
                  {badge && (
                    <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
                      {badge}
                    </div>
                  )}

                  {title && (
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                      {title}
                    </h1>
                  )}

                  {subtitle && (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {subtitle}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {actions}
                  <button
                    onClick={toggleDark}
                    className="rounded-2xl border border-slate-300 bg-white p-2.5 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    title={isDark ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {isDark ? <SunIcon /> : <MoonIcon />}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </header>
          )}

          <div
            className={
              contentFull
                ? "h-screen w-full overflow-hidden"
                : "bg-slate-50 px-6 py-6 dark:bg-slate-900 lg:px-10 lg:py-8"
            }
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}