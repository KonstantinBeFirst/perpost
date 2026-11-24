"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const TOPICS = ["Kündigung", "Widerspruch", "Einschreiben", "Mietkaution", "Mahnung", "Weihnachtsbrief", "Antrag", "Beschwerde", "Brief mit Foto", "Liebesbrief"];

function Row({ items, sep, className }: { items: string[]; sep: React.ReactNode; className: string }) {
  return (
    <div className={`flex shrink-0 items-center ${className}`}>
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5 sm:px-7">{t}</span>
          {sep}
        </span>
      ))}
    </div>
  );
}

/** Two crossing bands: yellow parcel tape and a green topic band, both nudged by scroll. */
export default function Tape() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const a = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const b = useTransform(scrollYProgress, [0, 1], ["-18%", "0%"]);
  const tape = Array.from({ length: 8 }, () => "PerPost");

  return (
    <div ref={ref} className="relative my-24 h-[240px] overflow-hidden sm:my-32 sm:h-[300px]" aria-hidden>
      <motion.div style={{ x: b }} className="absolute left-[-10%] top-[46%] w-[140%] -translate-y-1/2 rotate-[3deg] bg-brand py-4 shadow-[0_20px_40px_-20px_rgba(16,43,35,0.6)] sm:py-5">
        <div className="tape-run-rev flex w-max">
          {[0, 1].map((k) => (
            <Row key={k} items={TOPICS} className="font-display text-[26px] font-black tracking-[-0.018em] text-white sm:text-[40px]" sep={<span className="text-accent">✦</span>} />
          ))}
        </div>
      </motion.div>
      <motion.div style={{ x: a }} className="absolute left-[-10%] top-[50%] w-[140%] -translate-y-1/2 -rotate-[4deg] bg-accent py-3 shadow-[0_20px_40px_-18px_rgba(16,43,35,0.45)] sm:py-4">
        {/* tape texture */}
        <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.18)_0_2px,transparent_2px_18px)]" />
        <div className="tape-run flex w-max">
          {[0, 1].map((k) => (
            <Row
              key={k}
              items={tape}
              className="font-display text-[22px] font-black uppercase tracking-[0.04em] text-ink sm:text-[30px]"
              sep={
                <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-ink/70 sm:text-[13px]">
                  <svg width="22" height="14" viewBox="0 0 22 14">
                    <rect x="0.5" y="0.5" width="21" height="13" rx="2" fill="none" stroke="currentColor" />
                    <path d="M1 1 L11 8 L21 1" fill="none" stroke="currentColor" />
                  </svg>
                  Smart Letters
                </span>
              }
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
