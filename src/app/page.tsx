import { BenefitsSection } from "@/features/landing/components/benefits-section";
import { ComparisonSection } from "@/features/landing/components/comparison-section";
import { CoverageSection } from "@/features/landing/components/coverage-section";
import { FaqSection } from "@/features/landing/components/faq-section";
import { FinalCta } from "@/features/landing/components/final-cta";
import { Footer } from "@/features/landing/components/footer";
import { HeroSection } from "@/features/landing/components/hero-section";
import { LeadCaptureSection } from "@/features/landing/components/lead-capture-section";
import { Navbar } from "@/features/landing/components/navbar";
import { PricingSection } from "@/features/landing/components/pricing-section";
import { TestimonialsSection } from "@/features/landing/components/testimonials-section";
import { TrustIndicators } from "@/features/landing/components/trust-indicators";

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950 focus:shadow-card">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <HeroSection />
        <TrustIndicators />
        <PricingSection />
        <BenefitsSection />
        <ComparisonSection />
        <CoverageSection />
        <LeadCaptureSection />
        <TestimonialsSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
