import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setClerkTokenGetter } from "../lib/clerkToken";

export default function ClerkTokenBridge() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setClerkTokenGetter(getToken);
    }
  }, [getToken, isLoaded, isSignedIn]);

  return null;
}