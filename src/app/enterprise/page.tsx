import type { Metadata } from "next";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import EnterpriseSection from "@/components/sections/EnterpriseSection";

export const metadata: Metadata = {
  title: "Enterprise AI Support Platform & Security — Assistly",
  description: "Secure, compliant, and scalable customer support infrastructure with SSO, Audit Logs, Role Management, Custom AI Models, and 24/7 dedicated support SLAs.",
  alternates: { canonical: "/enterprise" },
};

export default function EnterprisePage() {
  return (
    <SubpageLayout accentColor="#f59e0b">
      <div style={{ marginTop: "-20px" }}>
        <EnterpriseSection />
      </div>
    </SubpageLayout>
  );
}
