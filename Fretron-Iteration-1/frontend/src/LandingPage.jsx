import truckImg from "./assets/truck-road.png";
import warehouseImg from "./assets/warehouse.png";
import { Link } from "react-router-dom";
export default function FretronLandingPage() {
  const navLinks = ["Home", "How It Works", "Services", "About", "Contact"];

  const trustPoints = [
    "Flexible transport options",
    "Transparent pricing",
    "Easy booking flow",
    "Shipment tracking",
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Shipment Request",
      description:
        "Add your pickup and destination cities, shipment size, timing, and delivery preferences in a few simple steps.",
    },
    {
      number: "02",
      title: "Explore Matching Transport Options",
      description:
        "Compare available routes, cargo space, pricing, and schedules from transport providers already heading your way.",
    },
    {
      number: "03",
      title: "Choose the Best Fit",
      description:
        "Pick the transport option that best matches your budget, timeline, and shipment needs with full clarity.",
    },
    {
      number: "04",
      title: "Track Shipment Progress",
      description:
        "Stay informed from booking to pickup, in-transit movement, and final delivery through a clear status flow.",
    },
  ];

  const features = [
    {
      title: "Post a Shipment",
      description:
        "Create shipment requests for parcels, goods, or small cargo moving between cities.",
    },
    {
      title: "Browse Available Transport",
      description:
        "Discover listed routes and spare cargo capacity that match your destination and schedule.",
    },
    {
      title: "Book with Confidence",
      description:
        "Compare route, timing, price, and available space before choosing the most suitable transport option.",
    },
    {
      title: "Track Delivery",
      description:
        "Monitor shipment movement through booking, pickup, transit, and delivery updates.",
    },
    {
      title: "Support Business Logistics",
      description:
        "Help businesses and shop owners move shipments more efficiently without arranging a full vehicle load.",
    },
    {
      title: "Access Flexible Capacity",
      description:
        "Use available space in vehicles already traveling between cities for smarter, more efficient logistics.",
    },
  ];

  const benefits = [
    "Compare route, timing, and price in one place",
    "Reduce wasted cargo space through smarter matching",
    "Designed for businesses, shop owners, and individual shippers",
    "A cleaner and more transparent way to discover transport options",
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white shadow-sm">
              F
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">Fretron</div>
              <div className="text-xs text-slate-500">Logistics Exchange Platform</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/driver-signup" className="hidden text-sm font-medium text-slate-500 hover:text-slate-900 md:inline-flex">
              Join as Driver
            </Link>
           
  <Link
    to="/user-login"
    className="hidden rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 md:inline-flex"
  >
    Login
  </Link>

  <Link
    to="/user-signup"
    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
  >
    Sign Up
  </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.06),_transparent_35%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Smarter intercity shipping for businesses and individuals
              </div>

              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Ship Smarter. Move Faster. Find the Right Transport with Confidence.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Connect with trusted transport providers, compare available cargo space, and book shipment options that fit your route, budget, and schedule.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                  Post a Shipment
                </button>
                <button className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50">
                  Browse Transport Options
                </button>
              </div>

              <a
                href="#drivers"
                className="mt-4 inline-flex text-sm font-medium text-slate-500 transition hover:text-slate-900"
              >
                Have available cargo space? Join as Driver
              </a>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-2xl font-semibold text-slate-950">2-way</div>
                  <div className="mt-1 text-sm text-slate-600">Marketplace discovery for shippers and transporters</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-2xl font-semibold text-slate-950">Flexible</div>
                  <div className="mt-1 text-sm text-slate-600">Match by route, timing, capacity, and price</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-2xl font-semibold text-slate-950">Clear</div>
                  <div className="mt-1 text-sm text-slate-600">A cleaner way to find and book intercity transport</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-blue-100 blur-2xl" />
              <div className="absolute -bottom-10 right-10 h-32 w-32 rounded-full bg-amber-100 blur-3xl" />

              <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
                <img
                  src={truckImg}
                  alt="Truck moving through an intercity route"
                  className="h-[420px] w-full object-cover lg:h-[520px]"
                />

                <div className="absolute left-5 top-5 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-blue-600">Live Route Match</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">Lahore → Islamabad</div>
                </div>

                <div className="absolute right-5 top-5 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
                  <div className="text-xs text-slate-500">Available Space</div>
                  <div className="mt-1 text-lg font-semibold text-slate-950">180 kg</div>
                </div>

                <div className="absolute bottom-5 left-5 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
                  <div className="text-xs text-slate-500">Scheduled Departure</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">Tomorrow, 9:30 AM</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-slate-50/80">
          <div className="mx-auto grid max-w-7xl gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200/70">
                <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                <span className="text-sm font-medium text-slate-700">{point}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              A simpler way to move goods between cities
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Fretron makes cargo discovery and booking easier for businesses and individuals who need flexible, transparent transport options.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-sm font-semibold text-slate-400">{step.number}</div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-b from-slate-50/70 to-blue-50/40">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Services</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                What you can do with Fretron
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Built to support real shipment needs with a practical, flexible marketplace experience.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white shadow-sm">
                    ●
                  </div>
                  <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Why choose Fretron</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Built for smarter logistics discovery and better cargo utilization
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Fretron gives users a more transparent way to find transport options while helping the ecosystem make better use of available cargo capacity.
              </p>

              <div className="mt-8 grid gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                  >
                    <div className="mt-1 h-5 w-5 rounded-full bg-blue-600" />
                    <p className="text-sm leading-7 text-slate-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl shadow-slate-300/30">
              <img
                src={warehouseImg}
                alt="Warehouse operations and parcel handling"
                className="h-full min-h-[420px] w-full object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent p-8 text-white">
                <div className="max-w-md rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                  <div className="text-sm text-blue-200">Why this matters</div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight">Less wasted space. Better shipment matching.</div>
                  <p className="mt-4 text-sm leading-7 text-slate-200">
                    Fretron creates a cleaner digital flow where shipment demand and available transport capacity can discover each other more efficiently.
                  </p>
                </div>
              </div>

              <div className="absolute right-5 top-5 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
                <div className="text-xs text-slate-500">Comparison</div>
                <div className="mt-1 text-lg font-semibold text-slate-950">Route • Time • Price</div>
              </div>

              <div className="absolute left-5 top-5 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur">
                <div className="text-xs text-slate-500">Audience</div>
                <div className="mt-1 text-lg font-semibold text-slate-950">Businesses & Individuals</div>
              </div>
            </div>
          </div>
        </section>

        <section id="drivers" className="bg-gradient-to-b from-white to-blue-50/50">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
              <div className="grid gap-10 p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">For transport partners</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Have available cargo space on your route?
                  </h2>
                  <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                    Join Fretron as a transport partner, publish your route, and connect with users looking for reliable shipment options. Turn unused cargo space into opportunity.
                  </p>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link to="/driver-signup" className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 text-center">
                      Join as Driver
                    </Link>
                    <Link to="/transporter-signup" className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 text-center">
                      Sign Up as Transporter
                    </Link>
                  </div>
                </div>

                <div className="rounded-[32px] bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_45%,#dbeafe_100%)] p-6">
                  <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">Transporter Route Card</div>
                        <div className="text-xs text-slate-500">Karachi → Multan</div>
                      </div>
                      <div className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                        Driver View
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="text-xs text-slate-500">Capacity</div>
                        <div className="mt-1 text-lg font-semibold text-slate-950">250 kg</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="text-xs text-slate-500">Departure</div>
                        <div className="mt-1 text-lg font-semibold text-slate-950">6:00 AM</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="text-xs text-slate-500">Price Basis</div>
                        <div className="mt-1 text-lg font-semibold text-slate-950">Per kg</div>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="text-xs text-slate-500">Status</div>
                        <div className="mt-1 text-lg font-semibold text-emerald-700">Open</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.1fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white">
                F
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight">Fretron</div>
                <div className="text-xs text-slate-500">Smarter intercity logistics</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
              Fretron connects shipment demand with available transport capacity for a more flexible and transparent logistics experience.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-950">Platform</div>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <a href="#">Home</a>
              <a href="#">How It Works</a>
              <a href="#">Services</a>
              <a href="#">About</a>
              <a href="#">Contact</a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-950">Account</div>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <Link to="/user-login">Login</Link>
<Link to="/user-signup">Sign Up</Link>
              <Link to="/driver-signup">Join as Driver</Link>
              <Link to="/privacy">Privacy Policy</Link>
<Link to="/terms">Terms</Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-950">Call to Action</div>
            <div className="mt-4 flex flex-col gap-3">
              <Link to="/user-signup" className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">
                   Post a Shipment
              </Link>
              <button className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                Browse Transport Options
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
