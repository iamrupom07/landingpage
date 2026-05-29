import { ArrowRight, Check, Gauge, Rocket, Zap } from "lucide-react";
import { FadeUp, SectionReveal } from "@/features/landing/components/section-reveal";
import { SectionHeading } from "@/features/landing/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "300 Mbps",
    price: "$59.99",
    description: "A dependable starting point for lean teams and small offices.",
    icon: Gauge,
    features: ["Small Office Ready", "Unlimited Data", "Business Support", "Static IP Available"]
  },
  {
    name: "1 Gig",
    price: "$99.99",
    description: "The best balance of speed, reliability, and team capacity.",
    icon: Rocket,
    recommended: true,
    features: ["Growing Teams", "Video Conferencing", "Cloud Applications", "Priority Support"]
  },
  {
    name: "2 Gig",
    price: "$134.99",
    description: "Premium performance for bandwidth-heavy business operations.",
    icon: Zap,
    features: ["Enterprise Performance", "Dedicated Resources", "Maximum Reliability", "Premium Support"]
  }
];

export function PricingSection() {
  return (
    <SectionReveal id="pricing" className="bg-slate-50">
      <div className="container">
        <SectionHeading
          eyebrow="Simple, transparent pricing"
          title="Choose the right speed for your business"
          description="Premium business internet plans with predictable monthly pricing and support that understands uptime."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <FadeUp key={plan.name} delay={index * 0.07}>
                <article
                  className={cn(
                    "relative flex h-full flex-col overflow-hidden rounded-lg border p-7 transition-all duration-300 hover:-translate-y-1",
                    plan.recommended
                      ? "surface-glow border-blue-200 shadow-lift ring-1 ring-blue-100"
                      : "border-slate-200 bg-white shadow-sm hover:border-emerald-200 hover:shadow-lift"
                  )}
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 top-0 h-1",
                      plan.recommended ? "bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-500" : "bg-slate-100"
                    )}
                  />
                  {plan.recommended ? (
                    <Badge variant="blue" className="absolute right-5 top-5 rounded-full">
                      Recommended
                    </Badge>
                  ) : null}
                  <span
                    className={cn(
                      "grid h-12 w-12 place-items-center rounded-lg",
                      plan.recommended
                        ? "bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-glow"
                        : "bg-emerald-50 text-emerald-600"
                    )}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-7 text-2xl font-extrabold text-slate-950">{plan.name}</h3>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">{plan.description}</p>
                  <div className="mt-7 flex items-end gap-1">
                    <span className={cn("font-display text-5xl font-extrabold", plan.recommended ? "display-gradient" : "text-slate-950")}>
                      {plan.price}
                    </span>
                    <span className="pb-2 text-base font-semibold text-slate-500">/mo</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm font-medium text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-9" variant={plan.recommended ? "primary" : "outline"}>
                    <a href="#quote">
                      Get Started
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </Button>
                </article>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
}
