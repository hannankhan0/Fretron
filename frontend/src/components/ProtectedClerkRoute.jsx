import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import ClerkSyncGate from "./ClerkSyncGate";

export default function ProtectedClerkRoute({ children }) {
  return (
    <>
      <SignedIn>
        <ClerkSyncGate>{children}</ClerkSyncGate>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn signInUrl="/user-login" />
      </SignedOut>
    </>
  );
}
