import { Quote } from "lucide-react";
import { FadeUp, SectionReveal } from "@/components/landing/section-reveal";
import { SectionHeading } from "@/components/landing/section-heading";

const testimonials = [
  {
    initials: "AR",
    company: "Apex Retail Group",
    quote:
      "The difference showed up immediately. Our POS systems, video calls, and cloud tools finally feel stable during peak hours.",
    focus: "Reliability"
  },
  {
    initials: "ML",
    company: "Meridian Legal",
    quote:
      "Support has been the biggest upgrade. We reach a business specialist quickly and get clear answers without bouncing between teams.",
    focus: "Customer Support"
  },
  {
    initials: "CC",
    company: "Compass Creative",
    quote:
      "We moved to a faster plan and still simplified our monthly spend. Transparent pricing made the decision easy.",
    focus: "Cost Savings"
  }
];

export function TestimonialsSection() {
  return (
    <SectionReveal className="bg-white">
      <div className="container">
        <SectionHeading
          eyebrow="Trusted by growing teams"
          title="Built around the outcomes businesses actually notice"
          description="Less downtime, faster support, cleaner billing, and a network that keeps up with real work."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <FadeUp key={testimonial.company} delay={index * 0.07}>
              <article className="h-full rounded-lg border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lift">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display grid h-12 w-12 place-items-center rounded-lg bg-slate-950 text-sm font-extrabold text-white">
                    {testimonial.initials}
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {testimonial.focus}
                  </span>
                </div>
                <Quote className="mt-7 h-6 w-6 text-blue-500" aria-hidden="true" />
                <p className="mt-4 text-base leading-8 text-slate-700">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="mt-6 text-sm font-bold text-slate-950">{testimonial.company}</p>
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
