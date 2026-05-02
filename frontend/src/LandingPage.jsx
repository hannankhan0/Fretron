import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import truckImg    from "./assets/truck-road.png";
import warehouseImg from "./assets/warehouse.png";
import { useTheme } from "./lib/useTheme";

// ── Inline icons ──────────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Truck SVG ─────────────────────────────────────────────────────────────────
function TruckSVG({ className = "" }) {
  return (
    <svg viewBox="0 0 220 72" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="0"   y="8"  width="138" height="46" rx="6" fill="#1e40af" />
      <rect x="3"   y="11" width="132" height="40" rx="4" fill="#2563eb" />
      <rect x="3"   y="11" width="132" height="7"  rx="3" fill="#1d4ed8" />
      <text x="30" y="37" fontSize="13" fill="white" fontWeight="800" letterSpacing="3" fontFamily="system-ui,sans-serif">FRETRON</text>
      <rect x="136" y="28" width="10"  height="8"  rx="3" fill="#475569" />
      <rect x="145" y="12" width="68"  height="42" rx="7" fill="#1e3a8a" />
      <rect x="154" y="16" width="40"  height="22" rx="4" fill="#bfdbfe" fillOpacity="0.9" />
      <rect x="156" y="18" width="8"   height="18" rx="2" fill="white"   fillOpacity="0.18" />
      <rect x="206" y="22" width="14"  height="24" rx="4" fill="#1e3a8a" />
      <rect x="213" y="26" width="4"   height="16" rx="2" fill="#0f172a" />
      <rect x="208" y="26" width="5"   height="8"  rx="2" fill="#fef08a" />
      <rect x="148" y="0"  width="8"   height="15" rx="4" fill="#334155" />
      <circle cx="152" cy="3" r="3" fill="#94a3b8" fillOpacity="0.5" />
      <rect x="208" y="44" width="12"  height="5"  rx="2" fill="#334155" />
      {[18, 50, 90].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={60} r="11" fill="#0f172a" />
          <circle cx={cx} cy={60} r="6.5" fill="#1e293b" />
          <circle cx={cx} cy={60} r="3" fill="#64748b" />
          <line x1={cx-6} y1={60} x2={cx+6} y2={60} stroke="#475569" strokeWidth="1.5" />
          <line x1={cx}   y1={54} x2={cx}   y2={66} stroke="#475569" strokeWidth="1.5" />
        </g>
      ))}
      {[162, 196].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={60} r="11" fill="#0f172a" />
          <circle cx={cx} cy={60} r="6.5" fill="#1e293b" />
          <circle cx={cx} cy={60} r="3" fill="#64748b" />
          <line x1={cx-6} y1={60} x2={cx+6} y2={60} stroke="#475569" strokeWidth="1.5" />
          <line x1={cx}   y1={54} x2={cx}   y2={66} stroke="#475569" strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}

// ── Scroll-triggered animated counter ─────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      let cur = 0;
      const steps = 55;
      const inc   = target / steps;
      const timer = setInterval(() => {
        cur += inc;
        if (cur >= target) { setValue(target); clearInterval(timer); }
        else setValue(Math.floor(cur));
      }, 1800 / steps);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

// ── Scroll reveal hook ────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Constants ────────────────────────────────────────────────────────────────
const FEATURE_ICONS = ["📦", "🗺️", "✅", "📡", "🏭", "⚡"];

// ── Main ─────────────────────────────────────────────────────────────────────
export default function FretronLandingPage() {
  const [dark, toggleDark] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  useScrollReveal();

  const navLinks = ["Home", "How It Works", "Services", "About", "Contact"];

  const steps = [
    { n: "01", title: "Create Your Shipment",     desc: "Add pickup and destination cities, shipment size, timing, and delivery preferences in a few simple steps." },
    { n: "02", title: "Explore Transport Options", desc: "Compare available routes, cargo space, pricing, and schedules from drivers already heading your way." },
    { n: "03", title: "Choose the Best Fit",       desc: "Pick the transport option that best matches your budget, timeline, and shipment needs with full clarity." },
    { n: "04", title: "Track Your Shipment",       desc: "Stay informed from booking through pickup, in-transit movement, and final delivery via clear status updates." },
  ];

  const features = [
    { title: "Post a Shipment",       desc: "Create shipment requests for parcels, goods, or small cargo moving between cities." },
    { title: "Browse Transport",      desc: "Discover listed routes and spare cargo capacity that match your destination and schedule." },
    { title: "Book with Confidence",  desc: "Compare route, timing, price, and available space before choosing the best option." },
    { title: "Track Delivery",        desc: "Monitor shipment movement through booking, pickup, transit, and delivery updates." },
    { title: "Business Logistics",    desc: "Help businesses and shop owners move shipments more efficiently without arranging a full vehicle." },
    { title: "Flexible Capacity",     desc: "Use available space in vehicles already traveling between cities for smarter logistics." },
  ];

  const stats = [
    { value: 500,  suffix: "+",  label: "Routes Daily" },
    { value: 50,   suffix: "+",  label: "Cities Covered" },
    { value: 98,   suffix: "%",  label: "On-Time Rate" },
    { value: 2400, suffix: "+",  label: "kg Moved / Day" },
  ];

  const benefits = [
    "Compare route, timing, and price in one place",
    "Reduce wasted cargo space through smarter matching",
    "Built for businesses, shop owners, and individual shippers",
    "A cleaner, more transparent way to discover transport",
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* ─── HEADER ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 lg:px-8">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/30">F</div>
            <div>
              <div className="text-base font-bold tracking-tight">Fretron</div>
              <div className="hidden text-[10px] leading-none text-slate-500 dark:text-slate-400 sm:block">Logistics Exchange · Pakistan</div>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white">
                {item}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleDark} aria-label="Toggle dark mode"
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800">
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link to="/user-signup?redirect=/driver-signup" className="hidden text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:text-slate-900 dark:hover:text-white md:inline-flex">
              Join as Driver
            </Link>
            <Link to="/user-login" className="hidden rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800 md:inline-flex">
              Login
            </Link>
            <Link to="/user-signup" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700">
              Sign Up
            </Link>
            <button onClick={() => setMenuOpen((v) => !v)} className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400 lg:hidden">
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {menuOpen && (
          <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pb-5 pt-3 lg:hidden">
            <nav className="grid gap-1">
              {navLinks.map((item) => (
                <a key={item} href="#" onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  {item}
                </a>
              ))}
            </nav>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/user-login" onClick={() => setMenuOpen(false)} className="rounded-xl border border-slate-300 dark:border-slate-700 py-2.5 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Login</Link>
              <Link to="/user-signup" onClick={() => setMenuOpen(false)} className="rounded-xl bg-blue-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700">Sign Up</Link>
              <Link to="/user-signup?redirect=/driver-signup" onClick={() => setMenuOpen(false)} className="col-span-2 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 py-2.5 text-center text-sm font-semibold text-blue-700 dark:text-blue-400">Join as Driver</Link>
            </div>
          </div>
        )}
      </header>

      <main>

        {/* ─── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Gradient mesh */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_0%_0%,rgba(59,130,246,0.11),transparent)] dark:bg-[radial-gradient(ellipse_70%_50%_at_0%_0%,rgba(59,130,246,0.07),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_105%_105%,rgba(99,102,241,0.08),transparent)]" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8 lg:py-24">

            {/* ── Text ── */}
            <div className="max-w-xl">
              <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-1.5 text-sm text-slate-600 dark:text-slate-400 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-glow" />
                Smarter intercity shipping for Pakistan
              </div>

              <h1 className="animate-fade-up animate-delay-100 text-4xl font-black leading-tight tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-[3.2rem]">
                Ship Smarter.<br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Move Faster.</span><br />
                Find the Right Transport.
              </h1>

              <p className="animate-fade-up animate-delay-200 mt-5 text-base leading-7 text-slate-600 dark:text-slate-400 sm:text-lg">
                Connect with trusted transport providers, compare available cargo space, and book shipment options that fit your route, budget, and schedule.
              </p>

              {/* Animated route strip */}
              <div className="animate-fade-up animate-delay-300 mt-6 flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">LHR</span>
                </div>
                <div className="relative flex-1 overflow-hidden h-2 flex items-center">
                  <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full" />
                  <div className="road-dashes absolute inset-0" style={{ backgroundSize: "50px 2px", backgroundPosition: "0 center" }} />
                  <span className="absolute left-1/3 text-base">🚛</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="h-3 w-3 rounded-full bg-red-500 ring-4 ring-red-500/20" />
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">ISB</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="animate-fade-up animate-delay-400 mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/user-signup?redirect=/user-dashboard/post-shipment"
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-700 hover:-translate-y-0.5">
                  Post a Shipment →
                </Link>
                <Link to="/user-login?redirect=/user-dashboard/browse-routes"
                  className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800">
                  Browse Transport
                </Link>
              </div>

              <a href="#drivers" className="animate-fade-up animate-delay-500 mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 transition hover:text-blue-600">
                Have cargo space? Join as Driver ↓
              </a>

              {/* Mini stats */}
              <div className="animate-fade-up animate-delay-600 mt-8 grid grid-cols-3 gap-3">
                {[{ v: "2-way", l: "Marketplace" }, { v: "Flexible", l: "Route & Price" }, { v: "Clear", l: "Transparent" }].map((s) => (
                  <div key={s.v} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm">
                    <div className="text-base font-black text-slate-950 dark:text-white">{s.v}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Hero image ── */}
            <div className="relative animate-slide-right animate-delay-200">
              <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-blue-400/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 right-0 h-48 w-48 rounded-full bg-indigo-400/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl">
                <img src={truckImg} alt="Truck on intercity route" className="h-[320px] w-full object-cover sm:h-[400px] lg:h-[480px]" />

                <div className="animate-badge-pop glass-card animate-float absolute left-4 top-4 rounded-2xl border border-white/60 dark:border-slate-600/60 px-3.5 py-2.5 shadow-xl">
                  <div className="text-[9px] font-black uppercase tracking-widest text-blue-600">Live Match</div>
                  <div className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">Lahore → Islamabad</div>
                </div>
                <div className="animate-badge-pop animate-delay-200 glass-card animate-float-slow absolute right-4 top-4 rounded-2xl border border-white/60 dark:border-slate-600/60 px-3.5 py-2.5 shadow-xl">
                  <div className="text-[9px] text-slate-500 dark:text-slate-400">Available Space</div>
                  <div className="mt-0.5 text-xl font-black text-slate-950 dark:text-white">180 kg</div>
                </div>
                <div className="animate-badge-pop animate-delay-400 glass-card absolute bottom-4 left-4 rounded-2xl border border-white/60 dark:border-slate-600/60 px-3.5 py-2.5 shadow-xl">
                  <div className="text-[9px] text-slate-500 dark:text-slate-400">Scheduled Departure</div>
                  <div className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">Tomorrow, 9:30 AM</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TRUCK ROAD ANIMATION ──────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-slate-900 dark:bg-slate-950" style={{ height: "108px" }}>
          {/* Road gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900 dark:from-[#0a0f1e] dark:to-slate-950" />
          {/* Edge stripes */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-amber-400/25" />
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-amber-400/25" />
          {/* Center dashes */}
          <div className="road-dashes absolute left-0 right-0" style={{ top: "50%", height: "3px", transform: "translateY(-50%)" }} />
          {/* Truck */}
          <div className="animate-truck absolute bottom-3" style={{ willChange: "transform" }}>
            <TruckSVG className="h-16 w-auto drop-shadow-2xl" />
          </div>
          {/* Overlay label */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="select-none text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 dark:text-slate-700">
              Connecting Pakistan — City by City
            </p>
          </div>
        </div>

        {/* ─── TRUST STRIP ───────────────────────────────────────────────────── */}
        <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40">
          <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {["Flexible transport options", "Transparent pricing", "Easy booking flow", "Shipment tracking"].map((p) => (
              <div key={p} className="flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 px-4 py-3.5 shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/50">
                <div className="h-2 w-2 flex-none rounded-full bg-blue-600" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{p}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── STATS ─────────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="reveal grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`reveal reveal-delay-${i + 1} rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 text-center shadow-sm`}>
                <div className="text-4xl font-black text-blue-600">
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
          <div className="reveal max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">How it works</p>
            <h2 className="mt-2.5 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">A simpler way to move goods between cities</h2>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">Fretron makes cargo discovery and booking easier for businesses and individuals.</p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.n}
                className={`reveal reveal-delay-${i + 1} group relative rounded-[22px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:hover:shadow-blue-900/10 hover:border-blue-200 dark:hover:border-blue-800`}>
                {/* Step badge */}
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-sm font-black text-blue-600 dark:text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white">
                  {step.n}
                </div>
                {/* Connector (desktop) */}
                {i < 3 && <div className="absolute -right-3 top-10 hidden h-px w-6 border-t-2 border-dashed border-blue-200 dark:border-blue-900 xl:block" />}
                <h3 className="text-base font-bold text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FEATURES ──────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-slate-50/60 to-blue-50/20 dark:from-slate-900/60 dark:to-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
            <div className="reveal max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Services</p>
              <h2 className="mt-2.5 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">What you can do with Fretron</h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map((f, i) => (
                <div key={f.title}
                  className={`reveal reveal-delay-${(i % 3) + 1} group rounded-[22px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800`}>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-xl shadow-lg shadow-blue-600/20 transition group-hover:scale-110">
                    {FEATURE_ICONS[i]}
                  </div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WHY FRETRON ────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="reveal">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Why Fretron</p>
              <h2 className="mt-2.5 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">Built for smarter logistics and better cargo utilization</h2>
              <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-400">Fretron gives users a transparent way to find transport while helping drivers maximize cargo utilization.</p>
              <div className="mt-7 grid gap-3">
                {benefits.map((b, i) => (
                  <div key={b} className={`reveal reveal-delay-${i + 1} flex items-start gap-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3.5 shadow-sm`}>
                    <div className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{i + 1}</div>
                    <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{b}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal reveal-delay-2 relative overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-700 shadow-2xl">
              <img src={warehouseImg} alt="Warehouse" className="min-h-[340px] w-full object-cover sm:min-h-[420px]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent p-6">
                <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                  <div className="text-xs text-blue-300">Why this matters</div>
                  <div className="mt-1.5 text-xl font-bold text-white">Less wasted space. Better matching.</div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Smarter discovery between shipment demand and available transport capacity.</p>
                </div>
              </div>
              <div className="glass-card animate-float-slow absolute right-4 top-4 rounded-2xl border border-white/50 dark:border-slate-700/50 px-3.5 py-2.5 shadow-xl">
                <div className="text-[9px] text-slate-500">Compare</div>
                <div className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">Route · Time · Price</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FOR DRIVERS ────────────────────────────────────────────────────── */}
        <section id="drivers" className="bg-gradient-to-b from-white dark:from-slate-950 to-blue-50/40 dark:to-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
            <div className="reveal overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
              <div className="grid gap-8 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">For Transport Partners</p>
                  <h2 className="mt-2.5 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">Have available cargo space on your route?</h2>
                  <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">Join Fretron as a transport partner, publish your route on a map, and connect with shippers. Turn unused cargo space into opportunity.</p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link to="/user-signup?redirect=/driver-signup" className="rounded-2xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-700 hover:-translate-y-0.5">Join as Driver →</Link>
                    <Link to="/transporter-signup" className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700">Sign Up as Transporter</Link>
                  </div>
                </div>

                {/* Mock driver card */}
                <div className="rounded-[22px] bg-gradient-to-br from-slate-100 to-blue-100/50 dark:from-slate-800 dark:to-blue-950/30 p-4">
                  <div className="rounded-[18px] border border-white/60 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-5 shadow-sm backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">Route Card</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Karachi → Multan</div>
                      </div>
                      <div className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">Driver View</div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {[
                        { l: "Capacity",    v: "250 kg",  c: "" },
                        { l: "Departure",   v: "6:00 AM", c: "" },
                        { l: "Price Basis", v: "Per kg",  c: "" },
                        { l: "Status",      v: "Open",    c: "text-emerald-600 dark:text-emerald-400" },
                      ].map(({ l, v, c }) => (
                        <div key={l} className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-3.5">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400">{l}</div>
                          <div className={`mt-1 text-base font-bold ${c || "text-slate-950 dark:text-white"}`}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">F</div>
              <div>
                <div className="text-base font-bold">Fretron</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Smarter intercity logistics</div>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-400">Connecting shipment demand with available transport capacity across Pakistan.</p>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Platform</div>
            <div className="mt-4 grid gap-2.5 text-sm text-slate-600 dark:text-slate-400">
              {["Home", "How It Works", "Services", "About", "Contact"].map((l) => (
                <a key={l} href="#" className="transition hover:text-slate-900 dark:hover:text-white">{l}</a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Account</div>
            <div className="mt-4 grid gap-2.5 text-sm text-slate-600 dark:text-slate-400">
              <Link to="/user-login"   className="transition hover:text-slate-900 dark:hover:text-white">Login</Link>
              <Link to="/user-signup"  className="transition hover:text-slate-900 dark:hover:text-white">Sign Up</Link>
              <Link to="/user-signup?redirect=/driver-signup" className="transition hover:text-slate-900 dark:hover:text-white">Join as Driver</Link>
              <Link to="/privacy"      className="transition hover:text-slate-900 dark:hover:text-white">Privacy Policy</Link>
              <Link to="/terms"        className="transition hover:text-slate-900 dark:hover:text-white">Terms</Link>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Get Started</div>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link to="/user-signup" className="rounded-2xl bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition">Post a Shipment</Link>
              <Link to="/user-login?redirect=/user-dashboard/browse-routes" className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">Browse Transport</Link>
              <button onClick={toggleDark} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition">
                {dark ? <SunIcon /> : <MoonIcon />}
                {dark ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-4 text-center text-xs text-slate-400 dark:text-slate-600">
          © {new Date().getFullYear()} Fretron. All rights reserved. Built for Pakistan's intercity logistics.
        </div>
      </footer>
    </div>
  );
}
