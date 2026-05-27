import { Cloud, Download, Headset, Lock, Network, SlidersHorizontal } from "lucide-react";
import { FadeUp, SectionReveal } from "@/components/landing/section-reveal";
import { SectionHeading } from "@/components/landing/section-heading";

const benefits = [
  {
    title: "Faster Upload & Download Speeds",
    description: "Keep cloud apps, calls, backups, and customer systems moving without the lag.",
    icon: Download
  },
  {
    title: "Reliable Business Connectivity",
    description: "Built for teams that need their internet to work like infrastructure, not a gamble.",
    icon: Network
  },
  {
    title: "24/7 Dedicated Support",
    description: "Reach real business support whenever uptime, configuration, or service questions matter.",
    icon: Headset
  },
  {
    title: "Scalable Plans",
    description: "Upgrade cleanly as your locations, users, devices, and cloud needs grow.",
    icon: SlidersHorizontal
  },
  {
    title: "Network Security",
    description: "Business-ready options for safer connectivity, static IPs, and critical workflows.",
    icon: Lock
  },
  {
    title: "Simple Installation",
    description: "Clear scheduling, local coordination, and a smooth path from quote to activation.",
    icon: Cloud
  }
];

export function BenefitsSection() {
  return (
    <SectionReveal id="features" className="bg-white">
      <div className="container">
        <SectionHeading
          eyebrow="Built for modern work"
          title="Business internet that keeps the whole operation moving"
          description="Every plan is designed around the daily realities of modern teams: video, cloud apps, payments, phones, security, and always-on customer service."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <FadeUp key={benefit.title} delay={index * 0.05}>
                <article className="group relative h-full overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lift">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative grid h-11 w-11 place-items-center rounded-lg bg-slate-50 text-slate-900 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:shadow-glow">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display relative mt-5 text-xl font-extrabold leading-7 text-slate-950">{benefit.title}</h3>
                  <p className="relative mt-3 text-sm leading-6 text-slate-600">{benefit.description}</p>
                </article>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
}
