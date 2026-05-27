import { Headphones, LockKeyhole, MapPinned, ShieldCheck } from "lucide-react";
import { FadeUp, SectionReveal } from "@/components/landing/section-reveal";

const indicators = [
  {
    label: "99.99% Uptime",
    description: "Business-grade network reliability for critical operations.",
    icon: ShieldCheck
  },
  {
    label: "24/7 Support",
    description: "Specialists available whenever your team needs help.",
    icon: Headphones
  },
  {
    label: "Enterprise Security",
    description: "Secure connectivity options for modern cloud workflows.",
    icon: LockKeyhole
  },
  {
    label: "Local Business Specialists",
    description: "Guidance from teams who understand your service area.",
    icon: MapPinned
  }
];

export function TrustIndicators() {
  return (
    <SectionReveal className="bg-white">
      <div className="container">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {indicators.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeUp key={item.label} delay={index * 0.06}>
                <div className="group relative h-full overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lift">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-5 text-xl font-extrabold text-slate-950">{item.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
}
