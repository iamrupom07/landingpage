import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/landing/section-reveal";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <SectionReveal className="bg-white">
      <div className="container">
        <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950 px-6 py-14 text-center shadow-lift sm:px-10 lg:py-16">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.34),transparent_38%),linear-gradient(55deg,rgba(16,185,129,0.26),transparent_54%)]" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-extrabold leading-[1.06] text-white sm:text-4xl lg:text-5xl">
              Ready For Better Business Internet?
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">Get a custom quote tailored to your business.</p>
            <Button asChild size="lg" variant="primary" className="mt-8 bg-white text-slate-950 hover:bg-slate-100">
              <a href="#quote">
                Request My Quote
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
