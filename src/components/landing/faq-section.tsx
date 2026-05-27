import { SectionReveal } from "@/components/landing/section-reveal";
import { SectionHeading } from "@/components/landing/section-heading";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How long does installation take?",
    answer:
      "Most business installations can be scheduled within a few business days after availability is confirmed. Larger or multi-location deployments may require a custom installation timeline."
  },
  {
    question: "Are contracts required?",
    answer:
      "Plan options can vary by location and business needs. A specialist will walk through available terms and pricing before you commit."
  },
  {
    question: "Do you offer static IPs?",
    answer:
      "Yes. Static IP options are available for businesses that need remote access, hosting, security appliances, or advanced network configuration."
  },
  {
    question: "Is support available 24/7?",
    answer:
      "Yes. Business support is available around the clock for connectivity issues, service questions, and plan assistance."
  },
  {
    question: "Can plans scale with my business?",
    answer:
      "Yes. Plans are designed to scale as your employee count, devices, cloud usage, video traffic, and business locations grow."
  }
];

export function FaqSection() {
  return (
    <SectionReveal className="bg-slate-50">
      <div className="container">
        <SectionHeading
          eyebrow="FAQ"
          title="Business internet questions, answered"
          description="A few quick answers before you request your custom quote."
        />
        <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-slate-200 bg-white px-5 shadow-lift sm:px-8">
          <Accordion type="single" collapsible defaultValue="item-0">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </SectionReveal>
  );
}
