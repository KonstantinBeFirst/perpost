"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { PER_PAGE, euro, prices } from "@/lib/content";
import { Eyebrow, H2, Mark, Reveal, ease } from "./ui";

const art = [
  // plain letter
  <path key="a" d="M6 10h36v24H6zM6 10l18 13 18-13" />,
  // letter dropped in slot
  <path key="b" d="M8 8h32v6H8zM14 14v18h20V14M20 22h8" />,
  // signature
  <path key="c" d="M6 34c6-10 10-14 13-12s-2 10 2 10 6-12 10-12 3 8 6 8 4-4 5-4M6 38h36" />,
  // return card
  <path key="d" d="M10 8h28v32H10zM16 16h16M16 22h16M16 30c3-4 5-4 7-2s4 2 7-2" />,
];

export default function Pricing() {
  const [pages, setPages] = useState(1);
  const extra = (pages - 1) * PER_PAGE;

  return (
    <section id="preise" className="scroll-mt-20 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <Eyebrow>Preise</Eyebrow>
            <H2 className="mt-4 max-w-[760px] text-ink">
              Porto inklusive. <Mark>Immer.</Mark>
            </H2>
            <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-ink-2">
              Erste Seite, Farbdruck, Umschlag und Porto sind im Preis. Endpreise inklusive Mehrwertsteuer.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-16 items-center gap-4 rounded-full border border-line bg-surface pl-6 pr-2">
              <span className="text-[14px] font-semibold text-ink-2">Seiten</span>
              <button
                onClick={() => setPages((p) => Math.max(1, p - 1))}
                disabled={pages === 1}
                aria-label="Eine Seite weniger"
                className="grid h-12 w-12 place-items-center rounded-full bg-soft text-[22px] text-brand transition hover:bg-brand hover:text-white disabled:opacity-40 disabled:hover:bg-soft disabled:hover:text-brand"
              >
                −
              </button>
              <span className="relative h-9 w-9 overflow-hidden text-center font-display text-[28px] font-black tabular-nums leading-9 text-ink" aria-live="polite">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span key={pages} className="absolute inset-0" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: -30 }} transition={{ duration: 0.3, ease }}>
                    {pages}
                  </motion.span>
                </AnimatePresence>
              </span>
              <button
                onClick={() => setPages((p) => Math.min(20, p + 1))}
                aria-label="Eine Seite mehr"
                className="grid h-12 w-12 place-items-center rounded-full bg-soft text-[22px] text-brand transition hover:bg-brand hover:text-white"
              >
                +
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {prices.map((p, i) => {
            const featured = "featured" in p && p.featured;
            return (
              <Reveal key={p.name} delay={i * 0.08}>
                <div data-cursor="Wählen" className={`group relative transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-2 ${i % 2 ? "hover:rotate-[1.2deg]" : "hover:-rotate-[1.2deg]"}`}>
                  {featured && (
                    <span className="absolute -top-3.5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-[11.5px] font-bold text-accent shadow-md">
                      Mit Empfängerunterschrift
                    </span>
                  )}
                  {/* perforated stamp */}
                  <div className="stamp p-[14px] shadow-[0_26px_50px_-28px_rgba(16,43,35,0.55)]">
                    <div className={`relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-[2px] p-5 ${featured ? "bg-brand text-white" : "bg-soft text-ink"}`}>
                      <div className="flex items-start justify-between">
                        <span className={`text-[10.5px] font-bold uppercase tracking-[0.2em] ${featured ? "text-accent" : "text-ink-2"}`}>Deutschland</span>
                        <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={featured ? "text-accent" : "text-brand"}>
                          {art[i]}
                        </svg>
                      </div>
                      <div className="mt-auto">
                        <div className="relative h-[64px] overflow-hidden">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.div
                              key={p.de + extra}
                              initial={{ y: 60 }}
                              animate={{ y: 0 }}
                              exit={{ y: -60 }}
                              transition={{ duration: 0.4, ease }}
                              className="absolute font-display text-[56px] font-black leading-none tracking-[-0.028em] tabular-nums"
                            >
                              {euro(p.de + extra)}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <div className="mt-2 text-[16px] font-bold">{p.name}</div>
                        <div className={`mt-1 text-[13.5px] ${featured ? "text-white/70" : "text-ink-2"}`}>{p.sub}</div>
                        <div className={`mt-4 border-t pt-3 text-[12.5px] ${featured ? "border-white/15 text-white/65" : "border-ink/10 text-ink-2"}`}>
                          Ausland: {p.abroad ? euro(p.abroad + extra) : "nicht verfügbar"}
                        </div>
                      </div>
                      {/* postmark on hover */}
                      <svg viewBox="0 0 200 120" className={`pointer-events-none absolute -right-10 top-10 w-[86%] opacity-0 transition duration-300 group-hover:opacity-100 ${featured ? "text-white/30" : "text-ink/25"}`}>
                        <circle cx="58" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="3" />
                        <text x="58" y="56" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor">BERLIN</text>
                        <text x="58" y="71" textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">PERPOST</text>
                        {[30, 48, 66, 84].map((y) => (
                          <path key={y} d={`M104 ${y} q 12 -8 24 0 t 24 0 t 24 0 t 24 0`} fill="none" stroke="currentColor" strokeWidth="3.2" />
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-8 grid gap-4 rounded-[22px] border border-dashed border-ink/15 p-5 text-[14px] leading-relaxed text-ink-2 sm:grid-cols-3 sm:p-6">
            <p>
              <b className="text-ink">Jede weitere Seite 0,25 €.</b> Farbdruck immer ohne Aufpreis.
            </p>
            <p>
              <b className="text-ink">Einschreiben nur innerhalb Deutschlands.</b> Die Deutsche Post nimmt über unsere Schnittstelle keine Einschreiben ins Ausland an.
            </p>
            <p>
              <b className="text-ink">Frankreich</b> versenden wir mit unserem französischen Partner zu eigenen Preisen. Den Gesamtpreis siehst du vor der Bestellung.
            </p>
          </div>
          <a href="/einschreiben-online-versenden/" className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand">
            Einwurf-Einschreiben, Einschreiben und Rückschein im Vergleich →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
