"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const heroStats = [
  { label: "Average install window", value: "3-5 days", icon: Wifi },
  { label: "Network uptime SLA", value: "99.99%", icon: ShieldCheck },
  { label: "Quote turnaround", value: "1 day", icon: BarChart3 }
];

const heroPills = ["No hidden fees", "Static IP options", "Local install team"];

// BUG FIX: The original had 3 Framer Motion infinity animations running
// permanently — background gradient pulse, and both floating cards —
// consuming CPU/GPU even when the section scrolled out of view.
// Fix: gate all repeat:Infinity animations on useInView so they pause
// automatically when the section is not visible.
export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.1 });

  // Only run infinity animations when visible AND motion is not reduced
  const shouldAnimate = inView && !reduceMotion;

  return (
    <section
      ref={sectionRef}
      id="top"
      className="hero-shell relative isolate overflow-hidden border-b border-slate-200/80 py-16 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

      {/* BUG FIX: was always-running — now gated on shouldAnimate */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-12 h-64 bg-[linear-gradient(90deg,rgba(37,99,235,0),rgba(37,99,235,0.14),rgba(16,185,129,0.16),rgba(37,99,235,0))] blur-3xl"
        animate={shouldAnimate ? { opacity: [0.55, 0.82, 0.55], x: [-24, 24, -24] } : { opacity: 0.55, x: 0 }}
        transition={{ duration: 10, repeat: shouldAnimate ? Infinity : 0, ease: "easeInOut" }}
      />

      <div className="container relative grid items-center gap-12 lg:grid-cols-[0.98fr_1.02fr]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <Badge variant="success" className="mb-6 rounded-full px-3 py-1 shadow-sm">
            Business Internet for modern teams
          </Badge>
          <h1 className="font-display max-w-3xl text-5xl font-extrabold leading-[0.96] text-slate-950 sm:text-6xl lg:text-7xl">
            Business Internet Built For <span className="display-gradient">Growth.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Reliable high-speed internet designed for modern businesses. Faster connections, lower downtime, and predictable pricing.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {heroPills.map((pill) => (
              <span key={pill} className="rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                {pill}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#quote">
                Get My Business Quote
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#pricing">View Plans</a>
            </Button>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {heroStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="group relative overflow-hidden rounded-lg border border-white/80 bg-white/80 p-4 shadow-card backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/95 hover:shadow-lift"
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 + index * 0.08, duration: 0.45 }}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <Icon className="mb-3 h-5 w-5 text-emerald-600" aria-hidden="true" />
                  <p className="font-display text-lg font-extrabold text-slate-950">{stat.value}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98, y: 18 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mesh-panel relative overflow-hidden rounded-lg border border-white/80 p-2 shadow-lift">
            <div className="absolute left-5 top-5 z-10 hidden rounded-full border border-white/70 bg-white/85 px-3 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur sm:block">
              Live business network
            </div>
            <Image
              src="/kinetic-business-hero.svg"
              alt="Modern business campus connected by high speed network lines"
              width={960}
              height={720}
              priority
              className="aspect-[4/3] w-full rounded-lg object-cover"
            />
          </div>

          {/* BUG FIX: floating cards were always-running — now gated on shouldAnimate */}
          <motion.div
            className="absolute -left-3 bottom-8 hidden w-48 rounded-lg border border-white/80 bg-white/90 p-4 shadow-lift backdrop-blur-xl sm:block"
            animate={shouldAnimate ? { y: [0, -10, 0] } : { y: 0 }}
            transition={{ duration: 5, repeat: shouldAnimate ? Infinity : 0, ease: "easeInOut" }}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-950">Local Support</p>
                <p className="text-xs text-slate-500">24/7 response team</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute right-3 top-6 hidden w-44 rounded-lg border border-white/80 bg-white/90 p-4 shadow-lift backdrop-blur-xl md:block"
            animate={shouldAnimate ? { y: [0, 10, 0] } : { y: 0 }}
            transition={{ duration: 5.5, repeat: shouldAnimate ? Infinity : 0, ease: "easeInOut" }}
          >
            <p className="text-sm font-semibold text-slate-500">Starting at</p>
            <p className="font-display mt-1 text-2xl font-extrabold text-slate-950">$59.99/mo</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
