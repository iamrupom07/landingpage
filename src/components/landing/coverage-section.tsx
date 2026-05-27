import { ArrowRight, Building2, Mail, MapPin, Phone } from "lucide-react";
import { FadeUp, SectionReveal } from "@/components/landing/section-reveal";
import { SectionHeading } from "@/components/landing/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const contactItems = [
  { label: "(555) 218-9044", icon: Phone },
  { label: "business@kinetic.example", icon: Mail },
  { label: "1200 Market Street, Suite 400", icon: Building2 }
];

export function CoverageSection() {
  return (
    <SectionReveal id="coverage" className="bg-white">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <FadeUp>
            <div className="relative min-h-[410px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-lift">
              <div className="map-grid absolute inset-0" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.12),transparent_36%),linear-gradient(45deg,rgba(22,163,74,0.12),transparent_48%)]" />
              <div className="absolute left-[8%] top-[21%] h-2 w-[84%] rotate-[-13deg] rounded-lg bg-blue-500/20" />
              <div className="absolute left-[10%] top-[58%] h-2 w-[78%] rotate-[9deg] rounded-lg bg-emerald-500/20" />
              <div className="absolute left-[26%] top-[10%] h-[78%] w-2 rotate-[18deg] rounded-lg bg-slate-400/10" />
              <div className="absolute left-[58%] top-[7%] h-[82%] w-2 rotate-[-7deg] rounded-lg bg-slate-400/10" />

              {[
                ["22%", "36%", "Downtown"],
                ["48%", "52%", "Retail Core"],
                ["69%", "31%", "Office Park"],
                ["76%", "66%", "Industrial"]
              ].map(([left, top, label]) => (
                <div key={label} className="absolute" style={{ left, top }}>
                  <span className="relative flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-md bg-emerald-400 opacity-45" />
                    <span className="relative inline-flex h-4 w-4 rounded-md border-2 border-white bg-emerald-500 shadow-sm" />
                  </span>
                  <span className="mt-2 block rounded-md border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur">
                    {label}
                  </span>
                </div>
              ))}

              <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/80 bg-white/90 p-5 shadow-lift backdrop-blur-xl">
                <p className="text-sm font-semibold text-slate-500">Live coverage model</p>
                <p className="font-display mt-1 text-2xl font-extrabold text-slate-950">Business connectivity zones</p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.08}>
            <SectionHeading
              align="left"
              eyebrow="Coverage"
              title="Business Connectivity Where You Need It"
              description="Check service availability for your office, storefront, warehouse, or multi-location business. Our local specialists can recommend the best plan for your address."
            />

            <form className="mt-8 rounded-lg border border-slate-200 bg-white p-4 shadow-sm" aria-label="Service availability checker">
              <label htmlFor="availability-address" className="mb-3 block text-sm font-semibold text-slate-800">
                Business address
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input id="availability-address" placeholder="Enter your business address" />
                <Button type="button" variant="primary" className="shrink-0">
                  Check Availability
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </form>

            <div className="mt-7 space-y-3">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-700">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {item.label}
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
              <MapPin className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
              Service availability and installation windows vary by address and business requirements.
            </div>
          </FadeUp>
        </div>
      </div>
    </SectionReveal>
  );
}
