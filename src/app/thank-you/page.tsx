import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Mail, Phone } from "lucide-react";
import { Navbar } from "@/features/landing/components/navbar";
import { Footer } from "@/features/landing/components/footer";

export const metadata = {
  title: "Quote Request Received | Kinetic Business",
  description: "Your business internet quote request has been received. A Kinetic Business specialist will be in touch shortly.",
};

export default function ThankYouPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-gradient-to-b from-white to-slate-50 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-slate-950 sm:text-4xl">
            Request Received!
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Thanks for reaching out. A Kinetic Business specialist will review your requirements and follow up within{" "}
            <strong className="text-slate-950">1 business day</strong> with a tailored quote.
          </p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-bold text-slate-900">Next Steps</p>
              </div>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li>&#10003; We&rsquo;ll confirm receipt via email</li>
                <li>&#10003; A specialist reviews your needs</li>
                <li>&#10003; Personalized quote sent within 24h</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-emerald-500" />
                <p className="text-sm font-bold text-slate-900">Need Help Now?</p>
              </div>
              <div className="space-y-2">
                <a href="tel:+18005551234" className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">
                  <Phone className="h-3.5 w-3.5" /> (800) 555-1234
                </a>
                <a href="mailto:sales@kinetic.biz" className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">
                  <Mail className="h-3.5 w-3.5" /> sales@kinetic.biz
                </a>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to homepage
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
