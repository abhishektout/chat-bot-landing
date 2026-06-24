import React, { Suspense } from "react";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password - Assistly",
  description: "Reset your Assistly account password using our secure verification workflow.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg)",
            color: "var(--muted-fg)",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: 600 }}>Loading Account Recovery...</div>
        </div>
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
