import { SignUp } from "@clerk/clerk-react";

export default function UserSignup() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create User Account</h1>
        <p style={styles.text}>Create your Fretron user account.</p>

        <SignUp
          routing="hash"
          signInUrl="/user-login"
          fallbackRedirectUrl="/user-dashboard"
          forceRedirectUrl="/user-dashboard"
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  title: {
    margin: "0 0 8px",
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  text: {
    margin: "0 0 20px",
    color: "#6b7280",
    textAlign: "center",
  },
};