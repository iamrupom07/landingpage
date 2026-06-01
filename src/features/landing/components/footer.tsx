import { BrandLogo } from "@/features/landing/components/brand-logo";
import { publicContact } from "@/lib/public-contact";

type FooterLink = {
  label: string;
  href?: string;
};

const footerGroups = [
  {
    title: "Company",
    links: [
      { label: "Why Kinetic", href: "#features" },
      { label: "Coverage", href: "#coverage" },
      { label: "Business Plans", href: "#pricing" },
      { label: "Careers", href: "#quote" }
    ]
  },
  {
    title: "Services",
    links: [
      { label: "Business Internet", href: "#pricing" },
      { label: "Static IP", href: "#quote" },
      { label: "Managed Wi-Fi", href: "#quote" },
      { label: "Multi-location", href: "#quote" }
    ]
  },
  {
    title: "Support",
    links: [
      { label: "Contact Support", href: "#quote" },
      { label: "Installation", href: "#quote" },
      { label: "Billing", href: "#quote" },
      { label: "Network Status", href: "#quote" }
    ]
  },
  {
    title: "Contact",
    links: [
      { label: publicContact.phone.display, href: publicContact.phone.href },
      { label: publicContact.email.display, href: publicContact.email.href },
      { label: publicContact.address }
    ]
  }
] satisfies Array<{ title: string; links: FooterLink[] }>;

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          <div>
            <BrandLogo />
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600">
              Reliable business internet for modern teams that depend on cloud apps, customer systems, and always-on communication.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-display text-sm font-extrabold text-slate-950">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      {link.href ? (
                        <a href={link.href} className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                          {link.label}
                        </a>
                      ) : (
                        <span className="text-sm text-slate-600">{link.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Kinetic Business. All rights reserved.</p>
          <p>Privacy-first quote requests. No surprise pricing.</p>
        </div>
      </div>
    </footer>
  );
}
