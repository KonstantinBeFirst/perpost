"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import StartForm from "@/components/StartForm";
import StoreBadges from "@/components/StoreBadges";
import { SplitChars } from "@/components/fx";
import { useIntroDone } from "@/lib/intro";

const EnvelopeScene = dynamic(() => import("./EnvelopeScene"), { ssr: false });

const SUN = "#F7CF70";

const STEPS = [
  { n: "01", t: "Du schreibst.", d: "In eigenen Worten oder per Diktat. Wir formulieren daraus einen sauberen Brief." },
  { n: "02", t: "Wir falzen und kuvertieren.", d: "Gedruckt in Farbe. Werktags zwischen 8 und 17 Uhr noch am selben Tag." },
  { n: "03", t: "Frankiert und gestempelt.", d: "Als Brief oder Einschreiben mit Sendungsnummer. Porto ist immer drin." },
  { n: "04", t: "Ab die Post.", d: "Die Deutsche Post stellt zu. Einschreiben in der Regel am nächsten Werktag." },
];
const AT = [0.1, 0.2, 0.48, 0.78];

export default function Hero3D() {
  const go = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 22, restDelta: 0.0005 });
  const [step, setStep] = useState(-1);

  useMotionValueEvent(p, "change", (v) => {
    scroll.current = v;
    let s = -1;
    AT.forEach((a, i) => {
      if (v >= a) s = i;
    });
    setStep(s);
  });

  const heroO = useTransform(p, [0, 0.07], [1, 0]);
  const heroY = useTransform(p, [0, 0.07], [0, -40]);
  const storyO = useTransform(p, [0.07, 0.11], [0, 1]);
  const rail = useTransform(p, [0.1, 0.98], [0, 1]);
  // faded layers must not catch clicks meant for the other one
  const heroPE = useTransform(p, (v) => (v < 0.06 ? "auto" : "none"));
  const storyPE = useTransform(p, (v) => (v > 0.08 ? "auto" : "none"));

  return (
    <section
      ref={ref}
      id="so-funktionierts" className="relative h-[420vh] bg-bg text-ink"
      onPointerMove={(e) => {
        pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
      }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* light */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_70%_40%,#fbf9f4_0%,#f2eee6_55%,#ebe6db_100%)]" />
        {/* light leaks: the glass panels refract these */}
        <div className="leak leak-sun drift left-[52%] top-[18%] h-[46vh] w-[46vh] opacity-60" />
        <div className="leak leak-warm drift left-[-8%] top-[58%] h-[40vh] w-[40vh] opacity-50 [animation-delay:-6s]" />
        <div className="leak leak-white right-[-6%] top-[-10%] h-[50vh] w-[50vh] opacity-90" />
        <div className="grain pointer-events-none absolute inset-0 opacity-70" />

        {go && <EnvelopeScene scroll={scroll} pointer={pointer} />}

        {/* hero copy */}
        <motion.div style={{ opacity: heroO, y: heroY, pointerEvents: heroPE }} className="relative z-10 mx-auto flex h-full max-w-[1360px] flex-col px-4 pt-[100px] sm:px-8 lg:justify-center lg:pt-[60px]">
          <div className="max-w-[720px]">
            <div className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-[#1f1e1e]/65">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: SUN }} />
              Brief online versenden
            </div>
            <h1 className="mt-5 font-display text-[clamp(52px,13.5vw,104px)] font-black leading-[0.86] tracking-[-0.03em]">
              <span className="block">
                <SplitChars text="Dein Brief." delay={0.15} play={go} />
              </span>
              <span className="block">
                <span className="marker">
                  <motion.span className="marker-ink !bottom-[0.06em] !h-[0.36em] !bg-[#F7CF70]" initial={{ scaleX: 0 }} animate={go ? { scaleX: 1 } : undefined} transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }} />
                  <SplitChars text="Ab die Post." delay={0.4} className="italic" play={go} />
                </span>
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={go ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-6 max-w-[480px] text-[17px] leading-relaxed text-[#1f1e1e]/65 sm:text-[18px]"
            >
              Wir drucken in Farbe, kuvertieren und bringen ihn zur Deutschen Post. <b className="text-[#1f1e1e]">Ab 2,50 € inklusive Porto.</b>
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={go ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 1.05, duration: 0.8 }}
              className="mt-7 max-w-[540px]"
            >
              <StartForm />
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={go ? { opacity: 1 } : undefined} transition={{ delay: 1.25 }} className="mt-5">
              <StoreBadges />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={go ? { opacity: 1 } : undefined}
            transition={{ delay: 2.4 }}
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#1f1e1e]/45 lg:flex"
          >
            <span className="relative block h-6 w-3.5 rounded-full border-2 border-[#1f1e1e]/30">
              <span className="absolute left-1/2 top-1 h-1.5 w-[2px] -translate-x-1/2 animate-bounce rounded bg-[#1f1e1e]/60" />
            </span>
            Scrollen
          </motion.div>
        </motion.div>

        {/* story captions */}
        <motion.div style={{ opacity: storyO }} className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-[1360px] flex-col justify-end px-4 pb-8 sm:px-8 lg:justify-center lg:pb-0">
          <motion.div style={{ pointerEvents: storyPE }} className="glass max-w-[480px] rounded-[28px] p-5 sm:p-7 lg:bg-none lg:!bg-transparent lg:!shadow-none lg:!border-transparent lg:p-0 lg:![backdrop-filter:none] lg:before:hidden">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#1f1e1e]/50">So funktioniert’s</span>
              <button
                type="button"
                onClick={() => {
                  const el = ref.current;
                  if (el) window.scrollTo({ top: el.offsetTop + el.offsetHeight, behavior: "smooth" });
                }}
                data-cursor="Weiter"
                className="glass inline-flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold text-[#1f1e1e]/75 transition hover:text-[#1f1e1e]"
              >
                Überspringen ↓
              </button>
            </div>
            <div className="mt-4 grid">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  className="[grid-area:1/1]"
                  aria-hidden={step !== i}
                  initial={false}
                  animate={{ opacity: step === i ? 1 : 0, y: step === i ? 0 : step > i ? -24 : 24, filter: step === i ? "blur(0px)" : "blur(8px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="font-serif text-[36px] italic leading-none text-[#1f1e1e]/25 lg:text-[54px]">{s.n}</div>
                  <h2 className="mt-1 font-display text-[clamp(30px,7.6vw,64px)] font-black leading-[0.95] tracking-[-0.025em]">{s.t}</h2>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-[#1f1e1e]/60 lg:text-[17px]">{s.d}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 h-[3px] overflow-hidden rounded bg-[#1f1e1e]/10">
              <motion.div className="h-full origin-left rounded bg-[#1f1e1e]" style={{ scaleX: rail }} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
