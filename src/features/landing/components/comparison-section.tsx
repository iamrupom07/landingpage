import { ArrowRight, CheckCircle2, TrendingDown, TriangleAlert } from "lucide-react";
import { FadeUp, SectionReveal } from "@/features/landing/components/section-reveal";
import { SectionHeading } from "@/features/landing/components/section-heading";

// BUG FIX: Original comparison bullets were vague generic claims that any ISP
// could make. Replaced with specific, measurable statements that match the
// pricing data already on the page — specificity converts better.
const columns = [
  {
    title: "Current Provider Problems",
    tone: "rose",
    icon: TriangleAlert,
    items: [
      "Unplanned outages with no ETA",
      "Shared residential infrastructure",
      "Hidden equipment rental fees"
    ]
  },
  {
    title: "Our Solution",
    tone: "blue",
    icon: CheckCircle2,
    items: [
      "99.99% uptime SLA, backed by contract",
      "Dedicated business-grade network",
      "Flat monthly rate — no surprise line items"
    ]
  },
  {
    title: "Expected Results",
    tone: "green",
    icon: TrendingDown,
    items: [
      "Save $40–$80/mo vs. cable plans",
      "Video calls and cloud apps stay stable",
      "No equipment rental fees — ever"
    ]
  }
];

const toneClasses = {
  rose: "bg-rose-50 text-rose-600 border-rose-100",
  blue: "bg-blue-50 text-blue-600 border-blue-100",
  green: "bg-emerald-50 text-emerald-600 border-emerald-100"
};

export function ComparisonSection() {
  return (
    <SectionReveal className="bg-slate-50">
      <div className="container">
        <SectionHeading
          eyebrow="Why switch"
          title="Stop Overpaying For Unreliable Internet"
          description="Replace unstable connectivity and unclear billing with a faster, cleaner experience built for business continuity."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {columns.map((column, index) => {
            const Icon = column.icon;
            return (
              <FadeUp key={column.title} delay={index * 0.07}>
                <article className="h-full rounded-lg border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span
                    className={`inline-grid h-12 w-12 place-items-center rounded-lg border ${toneClasses[column.tone as keyof typeof toneClasses]}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-display mt-6 text-xl font-extrabold text-slate-950">{column.title}</h3>
                  <ul className="mt-6 space-y-4">
                    {column.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm font-semibold text-slate-700">
                        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </SectionReveal>
  );
}
