import type { Metadata } from "next";
import SubpageLayout from "@/components/layouts/SubpageLayout";
import FeaturesSection from "@/components/sections/FeaturesSection";
import TechShowcaseSection from "@/components/sections/TechShowcaseSection";

export const metadata: Metadata = {
  title: "Platform Features & AI Infrastructure — Assistly",
  description: "Discover Assistly's 12 platform capabilities and the modern AI infrastructure supporting OpenAI, Claude, database integrations, and custom channels.",
  alternates: { canonical: "/features" },
};

export default function FeaturesPage() {
  return (
    <SubpageLayout accentColor="#00d4ff">
      <div style={{ display: "flex", flexDirection: "column", gap: "48px", marginTop: "-20px" }}>
        <FeaturesSection />
        <div style={{ borderTop: "1px solid var(--card-border)", paddingTop: "16px" }}>
          <TechShowcaseSection />
        </div>
      </div>
    </SubpageLayout>
  );
}
