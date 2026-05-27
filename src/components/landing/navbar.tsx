import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/landing/brand-logo";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Coverage", href: "#coverage" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#quote" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_12px_34px_rgba(15,23,42,0.06)] backdrop-blur-xl">
      <div className="container flex h-18 min-h-[72px] items-center justify-between gap-4">
        <BrandLogo />
        <nav className="hidden items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-50/80 p-1 shadow-sm md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-bold text-slate-600 transition-all hover:bg-white hover:text-slate-950 hover:shadow-sm"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Button asChild size="sm" className="hidden sm:inline-flex">
          <a href="#quote">
            Get Business Quote
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
        <Button asChild size="sm" className="sm:hidden">
          <a href="#quote">Quote</a>
        </Button>
      </div>
    </header>
  );
}
