"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { APP_STORE, GOOGLE_PLAY } from "@/lib/content";

/** Odometer: every digit rolls to its value on a vertical strip. */
function Odo({ value, go, delay = 0 }: { value: string; go: boolean; delay?: number }) {
  let d = 0;
  return (
    <span className="inline-flex">
      {value.split("").map((ch, i) => {
        if (!/\d/.test(ch)) return <span key={i}>{ch}</span>;
        const n = Number(ch);
        const my = delay + d++ * 0.08;
        return (
          <span key={i} className="relative inline-block h-[1em] overflow-hidden leading-none">
            <span className="invisible">0</span>
            <motion.span
              className="absolute left-0 top-0 flex flex-col"
              initial={{ y: "0%" }}
              animate={go ? { y: `-${(10 + n) * 5}%` } : undefined}
              transition={{ duration: 1.6, delay: my, ease: [0.16, 1, 0.3, 1] }}
            >
              {Array.from({ length: 20 }, (_, k) => (
                <span key={k} className="h-[1em] leading-none">
                  {k % 10}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

const items = [
  { v: "2,50", u: "€", l: "ab, mit Porto und Farbdruck" },
  { v: "4,6", u: "★", l: "App Store · 56 Bewertungen", href: APP_STORE },
  { v: "4,5", u: "★", l: "Google Play · über 90 Bewertungen", href: GOOGLE_PLAY },
  { v: "24/7", u: "", l: "bestellen, werktags gedruckt" },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const go = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="relative mx-auto max-w-[1320px] px-4 pt-14 sm:px-6 sm:pt-6">
      <div className="leak leak-sun drift left-[10%] top-[20%] h-[70%] w-[50%] opacity-70" />
      <div className="leak leak-warm drift right-[5%] top-[30%] h-[60%] w-[35%] opacity-50 [animation-delay:-5s]" />
      <div ref={ref} className="relative grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {items.map((it, i) => {
          const Tag = it.href ? "a" : "div";
          return (
            <Tag
              key={it.l}
              {...(it.href ? { href: it.href, target: "_blank", rel: "noopener", "data-cursor": "Ansehen" } : {})}
              className="glass group relative rounded-[26px] px-5 py-6 transition duration-500 hover:-translate-y-1 sm:px-7 sm:py-8"
            >
              <div className="flex items-start font-display text-[clamp(44px,11vw,76px)] font-black leading-none tracking-[-0.028em] text-ink">
                <Odo value={it.v} go={go} delay={i * 0.12} />
                {it.u && <span className={`ml-1 text-[0.42em] ${it.u === "★" ? "text-sun" : "text-brand"}`}>{it.u}</span>}
              </div>
              <div className="mt-3 text-[13.5px] leading-snug text-ink-2">
                {it.l}
                {it.href && <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>}
              </div>
            </Tag>
          );
        })}
      </div>
      <p className="mt-3 text-[11.5px] text-ink-2/80">Store-Bewertungen Deutschland, Stand 12.10.2026. Die Bewertungen erheben die Stores.</p>
    </section>
  );
}
