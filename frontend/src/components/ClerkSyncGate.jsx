import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

export default function ClerkSyncGate({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [state, setState] = useState("syncing");

  useEffect(() => {
    let cancelled = false;

    async function syncUser() {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        await apiRequest("/auth/clerk/sync-user", {
          method: "POST",
          body: JSON.stringify({
            fullName: user.fullName || user.username || "Fretron User",
            email: user.primaryEmailAddress?.emailAddress,
            phone: user.primaryPhoneNumber?.phoneNumber || null,
            businessName: null,
          }),
        });

        if (!cancelled) setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    }

    syncUser();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, user]);

  if (state === "ready") return children;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center text-sm text-slate-600">
      {state === "error" ? "Could not sync your Fretron user account. Please sign in again." : "Loading your Fretron account..."}
    </div>
  );
}
