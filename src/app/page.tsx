import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import SocialProof from "@/components/sections/SocialProof";
import ProblemSection from "@/components/sections/ProblemSection";
import SolutionSection from "@/components/sections/SolutionSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ComparisonSection from "@/components/sections/ComparisonSection";
import UseCasesSection from "@/components/sections/UseCasesSection";
import DemoSection from "@/components/sections/DemoSection";
import InsightsSection from "@/components/sections/InsightsSection";
import EnterpriseSection from "@/components/sections/EnterpriseSection";
import TechShowcaseSection from "@/components/sections/TechShowcaseSection";
import PricingSection from "@/components/sections/PricingSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <SocialProof />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <ComparisonSection />
      <UseCasesSection />
      <DemoSection />
      <InsightsSection />
      <EnterpriseSection />
      <TechShowcaseSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
