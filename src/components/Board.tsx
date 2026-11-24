"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useBerlinClock } from "@/lib/intro";
import { Eyebrow, H2, Reveal } from "./ui";

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜ0123456789:.-";

/** One split-flap cell: flips through characters before settling, like a station board. */
function Cell({ ch, go, delay }: { ch: string; go: boolean; delay: number }) {
  const [cur, setCur] = useState(" ");
  const [flip, setFlip] = useState(0);
  useEffect(() => {
    if (!go) return;
    const target = CHARS.indexOf(ch.toUpperCase());
    if (target < 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCur(ch);
      return;
    }
    let i = 0;
    const spins = 6 + Math.floor(Math.random() * 8);
    let n = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      n++;
      i = n >= spins ? target : Math.floor(Math.random() * CHARS.length);
      setCur(CHARS[i]);
      setFlip((f) => f + 1);
      if (n < spins) t = setTimeout(step, 55);
    };
    t = setTimeout(step, delay);
    return () => clearTimeout(t);
  }, [ch, go, delay]);

  return (
    <span className="flap relative inline-grid h-[1.6em] w-[1.05em] place-items-center overflow-hidden rounded-[3px] bg-[#1b1a1a] font-mono font-bold text-[#f3f0e2] shadow-[inset_0_-1px_0_rgba(255,255,255,0.05)]">
      <span key={flip} className="flap-in">
        {cur === " " ? " " : cur}
      </span>
      <span className="absolute inset-x-0 top-1/2 h-px bg-black/50" />
    </span>
  );
}

function FlapText({ text, go, base = 0, className = "" }: { text: string; go: boolean; base?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-[2px] ${className}`}>
      {text.split("").map((c, i) => (
        <Cell key={i} ch={c} go={go} delay={base + i * 35} />
      ))}
    </span>
  );
}

/** Live digits that flip on change (no spin), for the countdown. */
function Digits({ text }: { text: string }) {
  return (
    <span className="inline-flex gap-[3px]">
      {text.split("").map((c, i) => (
        <span key={i} className="flap relative inline-grid h-[1.5em] w-[0.95em] place-items-center overflow-hidden rounded-[4px] bg-[#1b1a1a] font-mono font-bold text-accent">
          <span key={c} className="flap-in">
            {c}
          </span>
          <span className="absolute inset-x-0 top-1/2 h-px bg-black/50" />
        </span>
      ))}
    </span>
  );
}

const ROWS = [
  ["BRIEF", "DEUTSCHLAND", "2. WERKTAG"],
  ["EINSCHREIBEN", "DEUTSCHLAND", "1. WERKTAG"],
  ["BRIEF", "AUSLAND", "JE NACH LAND"],
];

export default function Board() {
  const ref = useRef<HTMLDivElement>(null);
  const go = useInView(ref, { once: true, amount: 0.3 });
  const c = useBerlinClock();

  return (
    <section id="verarbeitung" className="scroll-mt-20 px-3 pt-28 sm:px-6 sm:pt-36">
      <div ref={ref} className="grain relative mx-auto max-w-[1320px] overflow-hidden rounded-[32px] bg-brand px-5 py-14 text-white sm:px-12 sm:py-20">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          <Reveal>
            <Eyebrow dark>Verarbeitung</Eyebrow>
            <H2 className="mt-4 text-white">Rund um die Uhr bestellt. Werktags gedruckt.</H2>
            <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-white/75">
              PerPost überträgt deinen Brief sofort verschlüsselt an unseren Versandpartner. Montag bis Freitag zwischen 8 und 17 Uhr wird er gedruckt, kuvertiert und noch am selben
              Arbeitstag eingeliefert, ausgenommen Feiertage.
            </p>
          </Reveal>

          <div className="glass-dark rounded-[26px] p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                <span className={`h-2 w-2 rounded-full ${c?.open ? "animate-pulse bg-[#3fb27f]" : "bg-sun"}`} />
                Abfahrt PerPost Berlin
              </div>
              <div className="text-[clamp(18px,4.6vw,26px)]">
                <Digits text={c?.time ?? "--:--"} />
              </div>
            </div>

            <div className="mt-4 rounded-[14px] bg-black/15 p-3 sm:p-4">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/50">{c?.open ? "Heute noch zur Post, bestellen bis 17:00" : "Nächster Druck"}</div>
              <div className="mt-2 text-[clamp(26px,8vw,44px)]">
                {c?.open ? <Digits text={c.countdown} /> : <FlapText text={(c?.next ?? "MORGEN 8:00").toUpperCase()} go={go} />}
              </div>
            </div>

            <div className="mt-5 hidden grid-cols-[1.25fr_1.1fr_1fr] gap-3 px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45 sm:grid">
              <span>Sendung</span>
              <span>Ziel</span>
              <span>Zustellung</span>
            </div>
            <div className="mt-2 space-y-3 sm:space-y-2">
              {ROWS.map((r, i) => (
                <div key={i} className="grid gap-1.5 border-b border-white/5 pb-3 text-[15px] last:border-0 sm:grid-cols-[1.25fr_1.1fr_1fr] sm:gap-3 sm:border-0 sm:pb-0 sm:text-[clamp(11px,1.15vw,15px)]">
                  <FlapText text={r[0].padEnd(12)} go={go} base={i * 260} />
                  <FlapText text={r[1].padEnd(11)} go={go} base={i * 260 + 120} />
                  <FlapText text={r[2].padEnd(12)} go={go} base={i * 260 + 240} className="[&_.flap]:text-accent" />
                </div>
              ))}
            </div>
            <p className="mt-5 text-[12px] leading-relaxed text-white/50">
              Regellaufzeiten der Deutschen Post ab Einlieferung, keine garantierten Termine. Quellen:{" "}
              <a className="underline underline-offset-2" href="https://www.deutschepost.de/de/b/briefe-in-deutschland.html" target="_blank" rel="noopener">
                Briefe
              </a>
              ,{" "}
              <a className="underline underline-offset-2" href="https://www.deutschepost.de/de/e/einschreiben/haeufige-fragen.html" target="_blank" rel="noopener">
                Einschreiben
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
