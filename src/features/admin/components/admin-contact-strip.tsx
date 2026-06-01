import { Building2, Mail, Phone } from "lucide-react";
import { publicContact } from "@/lib/public-contact";

export function AdminContactStrip() {
  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-left">
      <p className="text-xs font-bold uppercase text-slate-400">Support contact</p>
      <div className="mt-2 space-y-2">
        <a
          href={publicContact.phone.href}
          className="flex items-start gap-2 text-xs font-semibold text-blue-600 hover:underline"
        >
          <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 break-words">{publicContact.phone.display}</span>
        </a>
        <a
          href={publicContact.email.href}
          className="flex items-start gap-2 text-xs font-semibold text-blue-600 hover:underline"
        >
          <Mail className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 break-words">{publicContact.email.display}</span>
        </a>
        <div className="flex items-start gap-2 text-xs font-semibold text-slate-600">
          <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 break-words">{publicContact.address}</span>
        </div>
      </div>
    </div>
  );
}
