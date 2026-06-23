import type { Metadata } from "next";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import SolutionSection from "@/components/sections/SolutionSection";
import UseCasesSection from "@/components/sections/UseCasesSection";

export const metadata: Metadata = {
  title: "AI Support Solutions for Every Industry — Assistly",
  description: "Explore Assistly's custom AI solutions tailored for E-Commerce, SaaS, Healthcare, Finance, Education, and Travel businesses to automate support.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <SubpageLayout accentColor="#8b5cf6">
      <div style={{ display: "flex", flexDirection: "column", gap: "48px", marginTop: "-20px" }}>
        <SolutionSection />
        <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "16px" }}>
          <UseCasesSection />
        </div>
      </div>
    </SubpageLayout>
  );
}
