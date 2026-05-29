import { Clock3, FileCheck2, ShieldCheck, Users } from "lucide-react";
import { FadeUp, SectionReveal } from "@/features/landing/components/section-reveal";
import { LeadCaptureForm } from "@/features/landing/components/lead-capture-form";

const quoteBenefits = [
  { label: "Custom plan recommendation", icon: FileCheck2 },
  { label: "Fast specialist follow-up", icon: Clock3 },
  { label: "Secure business consultation", icon: ShieldCheck }
];

export function LeadCaptureSection() {
  return (
    <SectionReveal id="quote" className="bg-slate-50">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <FadeUp className="lg:pt-8">
            <p className="eyebrow mb-3">Request a quote</p>
            <h2 className="font-display text-4xl font-extrabold leading-[1.06] text-slate-950 sm:text-5xl">Request Your Business Internet Quote</h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Tell us about your business and we&apos;ll recommend the best plan for your needs.
            </p>

            <div className="mt-9 space-y-4">
              {quoteBenefits.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-9 rounded-lg border border-blue-100 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                  <Users className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-slate-950">Trusted by businesses across the country</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Offices, retailers, healthcare practices, agencies, warehouses, and local teams use Kinetic Business to stay connected.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.08}>
            <LeadCaptureForm />
          </FadeUp>
        </div>
      </div>
    </SectionReveal>
  );
}
