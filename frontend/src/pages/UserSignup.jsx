import { SignUp } from "@clerk/clerk-react";

export default function UserSignup() {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 mesh-gradient page-fade flex items-center justify-center p-5">
      <div className="pointer-events-none absolute -left-12 top-16 h-56 w-56 rounded-full bg-blue-400/15 blur-3xl animate-orb" />
      <div className="pointer-events-none absolute right-0 top-28 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl animate-orb-alt" />
      
      <div className="glass glass-shimmer w-full max-w-md rounded-[28px] p-8 shadow-xl shadow-slate-200/60 animate-fade-up">
        <h1 className="mb-2 text-center text-3xl font-semibold tracking-tight text-slate-950">Create User Account</h1>
        <p className="mb-8 text-center text-slate-600">Create your Fretron user account.</p>

        <div className="flex justify-center">
          <SignUp
            routing="hash"
            signInUrl="/user-login"
            fallbackRedirectUrl="/user-dashboard"
            forceRedirectUrl="/user-dashboard"
          />
        </div>
      </div>
    </div>
  );
}