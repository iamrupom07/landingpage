import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link href="#top" className={cn("group inline-flex items-center gap-3", className)} aria-label="Kinetic Business home">
      <span className="relative grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-slate-950 via-blue-600 to-emerald-500 shadow-[0_12px_30px_rgba(37,99,235,0.24)]">
        <span className="absolute left-2 top-2 h-6 w-2 rounded-sm bg-white/90 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span className="absolute right-2 top-2 h-3.5 w-3.5 rotate-45 rounded-sm bg-white/90 transition-transform duration-200 group-hover:translate-x-0.5" />
        <span className="absolute bottom-2 right-2 h-3.5 w-3.5 -rotate-45 rounded-sm bg-white/90 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
      <span className="leading-none">
        <span className="font-display block text-xl font-extrabold text-slate-950">kinetic</span>
        <span className="block text-[11px] font-bold uppercase text-slate-500">business</span>
      </span>
    </Link>
  );
}
