import { BrandLogo } from "@/components/landing/brand-logo";

const footerGroups = [
  {
    title: "Company",
    links: ["Why Kinetic", "Coverage", "Business Plans", "Careers"]
  },
  {
    title: "Services",
    links: ["Business Internet", "Static IP", "Managed Wi-Fi", "Multi-location"]
  },
  {
    title: "Support",
    links: ["Contact Support", "Installation", "Billing", "Network Status"]
  },
  {
    title: "Contact",
    links: ["(555) 218-9044", "business@kinetic.example", "1200 Market Street, Suite 400"]
  }
];

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
                    <li key={link}>
                      <a href="#quote" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                        {link}
                      </a>
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
