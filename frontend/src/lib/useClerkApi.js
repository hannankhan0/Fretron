import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setClerkTokenGetter } from "./clerkToken";

/**
 * useClerkApi — ensures Clerk token is available before any API call fires.
 *
 * Problem: Dashboard pages run useEffect on mount, but ClerkTokenBridge's
 * useEffect (sibling in the tree) may not have run yet on first render.
 * This hook ensures the token getter is set and returns `ready=true` only
 * when it's safe to call apiRequest().
 *
 * Usage:
 *   const apiReady = useClerkApi();
 *   useEffect(() => { if (!apiReady) return; loadData(); }, [apiReady]);
 *
 * Also works for JWT-auth pages: Clerk is not loaded → isLoaded=false → hook
 * still sets ready=true after a short timeout so JWT-cookie requests proceed.
 */
export function useClerkApi() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    // Set the token getter so future apiRequest() calls include Bearer header
    if (isSignedIn && getToken) {
      setClerkTokenGetter(getToken);
    }

    setReady(true);
  }, [getToken, isLoaded, isSignedIn]);

  return ready;
}
