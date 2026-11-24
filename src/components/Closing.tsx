"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Magnetic } from "./fx";
import Logo from "./Logo";
import { B2B, BRIEF_ORIGIN, faq } from "@/lib/content";
import { Eyebrow, H2, Mark, Reveal, ease } from "./ui";

export function Business() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-28 sm:px-6 sm:pt-36">
      <Reveal>
        <a
          href={B2B}
          target="_blank"
          rel="noopener"
          className="group relative flex flex-col gap-6 overflow-hidden rounded-[32px] bg-ink p-8 text-white transition sm:flex-row sm:items-center sm:justify-between sm:p-12"
        >
          <div className="leak leak-sun -right-[10%] -top-[40%] h-[180%] w-[45%] opacity-35 transition-opacity duration-700 group-hover:opacity-60" />
          <div className="relative">
            <Eyebrow dark>PerPost für Unternehmen</Eyebrow>
            <div className="mt-3 font-display text-[clamp(30px,6vw,52px)] font-black leading-[1] tracking-[-0.02em] text-white">
              Geschäftspost. Einfach weitergedacht.
            </div>
          </div>
          <span data-cursor="B2B" className="glass-dark relative inline-flex h-14 w-fit shrink-0 items-center gap-2 rounded-full px-7 text-[16px] font-semibold text-white transition duration-300 group-hover:bg-accent group-hover:text-ink">
            Zu PerPost Business ↗
          </span>
        </a>
      </Reveal>
    </section>
  );
}

export function Vision() {
  return (
    <section id="vision" className="scroll-mt-20 mx-auto max-w-[1000px] px-4 pt-28 text-center sm:px-6 sm:pt-40">
      <Reveal>
        <Eyebrow>Unsere Vision</Eyebrow>
        <p className="mt-6 font-serif text-[clamp(32px,6.4vw,60px)] leading-[1.08] tracking-[-0.01em] text-ink">
          Ein wichtiger Brief sollte nicht daran scheitern, dass <em className="text-brand">kein Drucker da ist</em>, die richtigen Worte fehlen oder der Weg zur Post nicht in
          den Alltag passt.
        </p>
        <p className="mx-auto mt-8 max-w-[620px] text-[17px] leading-relaxed text-ink-2">
          Wir bauen eine Plattform, die dich durch deine Briefkommunikation begleitet: vom ersten Gedanken über Schreiben und Versand bis zum Wiederfinden von Briefen,
          Terminen und Nachweisen. Für Menschen und Unternehmen, auf dem Handy und im Browser.
        </p>
      </Reveal>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="fragen" className="scroll-mt-20 mx-auto max-w-[1240px] px-4 pt-28 sm:px-6 sm:pt-36">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <Eyebrow>Häufige Fragen</Eyebrow>
          <H2 className="mt-4 text-ink">
            Gut zu <Mark>wissen.</Mark>
          </H2>
          <p className="mt-5 max-w-[360px] text-[16px] leading-relaxed text-ink-2">
            Noch etwas offen?{" "}
            <a href="/perpost-kundenservice/" className="font-semibold text-brand underline decoration-brand/30 underline-offset-4">
              Schreib unserem Kundenservice
            </a>
            .
          </p>
        </Reveal>
        <div className="glass divide-y divide-ink/[0.07] rounded-[28px] px-5 sm:px-8">
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[17px] font-semibold text-ink sm:text-[19px]">{f.q}</span>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-[18px] text-brand transition ${isOpen ? "rotate-45 bg-brand text-white" : ""}`}>
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-[640px] pb-6 text-[16px] leading-relaxed text-ink-2">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  const [drop, setDrop] = useState(false);
  return (
    <section className="px-3 pt-28 sm:px-6 sm:pt-36">
      <div className="grain relative mx-auto max-w-[1320px] overflow-hidden rounded-[32px] bg-accent px-5 pb-0 pt-16 sm:px-12 sm:pt-24">
        <div className="relative grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="pb-16 sm:pb-24">
            <h2 className="font-display text-[clamp(52px,13vw,148px)] font-black leading-[0.86] tracking-[-0.03em] text-ink">
              Ab die
              <br />
              Post.
            </h2>
            <p className="mt-6 max-w-[420px] text-[17px] leading-relaxed text-ink/75">Dein nächster Brief ist in zwei Minuten geschrieben. Druck, Umschlag und Porto ab 2,50 €.</p>
            <div className="mt-8" onPointerEnter={() => setDrop(true)} onPointerLeave={() => setDrop(false)} onFocus={() => setDrop(true)} onBlur={() => setDrop(false)}>
              <Magnetic>
                <a
                  href="#start"
                  data-cursor="Einwerfen"
                  className="group relative inline-flex h-16 items-center gap-3 overflow-hidden rounded-full bg-ink px-9 text-[18px] font-semibold text-white"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-brand transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
                  <span className="relative">Brief starten</span>
                  <span className="relative transition-transform group-hover:translate-x-1">→</span>
                </a>
              </Magnetic>
            </div>
          </Reveal>

          {/* mailbox: the envelope drops into the slot when the button is hovered */}
          <div className="relative mx-auto h-[300px] w-[230px] sm:h-[380px] sm:w-[280px]" aria-hidden>
            <motion.div
              className="absolute left-1/2 top-0 z-[1] h-[64px] w-[104px] -translate-x-1/2 rounded-[6px] bg-[#f6eed8] shadow-xl sm:h-[76px] sm:w-[124px]"
              animate={drop ? { y: 92, rotate: 0, scaleY: 0.2, opacity: 0 } : { y: [0, -10, 0], rotate: [-6, -3, -6], scaleY: 1, opacity: 1 }}
              transition={drop ? { duration: 0.55, ease: [0.55, 0, 0.9, 0.4] } : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 124 76">
                <path d="M2 4 L62 44 L122 4" stroke="#d9cba5" strokeWidth="1.6" fill="none" />
              </svg>
              <span className="absolute right-2 top-2 h-6 w-5 rounded-[2px] bg-brand" />
            </motion.div>
            {/* box */}
            <div className="absolute inset-x-0 bottom-0 z-[2] h-[76%] rounded-t-[110px] rounded-b-[10px] bg-[#ffcc00] shadow-[inset_-18px_0_0_rgba(0,0,0,0.06),0_40px_60px_-30px_rgba(16,43,35,0.5)]">
              <div className="absolute left-1/2 top-[20%] h-[12px] w-[58%] -translate-x-1/2 rounded-full bg-ink/85 shadow-[inset_0_3px_0_rgba(0,0,0,0.5)]" />
              <div className="absolute left-1/2 top-[38%] -translate-x-1/2 text-center">
                <svg width="64" height="40" viewBox="0 0 64 40" className="mx-auto text-ink/80">
                  <path d="M8 26c0-10 8-16 18-16h16c6 0 10 4 10 9s-4 9-10 9H22" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="54" cy="19" r="5" fill="currentColor" />
                  <path d="M4 22l6 4-6 4z" fill="currentColor" />
                </svg>
                <div className="mt-1 font-display text-[13px] font-black uppercase tracking-[0.3em] text-ink/80">Briefe</div>
              </div>
              <div className="absolute bottom-[12%] left-1/2 w-[64%] -translate-x-1/2 rounded-[4px] bg-white/85 px-2 py-1.5 text-center text-[10px] font-semibold leading-tight text-ink/75">
                Nächste Leerung
                <br />
                <span className="font-mono text-[12px] text-ink">jetzt, online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const cols = [
    {
      h: "PerPost",
      l: [
        ["So funktioniert’s", "#so-funktionierts"],
        ["Die App", "#app"],
        ["Preise", "#preise"],
        ["Einschreiben online versenden", "/einschreiben-online-versenden/"],
        ["Herzliche Briefe", "/herzliche-briefe/"],
        ["News & Aktuelles", "/aktuelles/"],
      ],
    },
    { h: "Für Unternehmen", l: [["PerPost Business ↗", B2B]] },
    {
      h: "Hilfe",
      l: [
        ["Häufige Fragen", "#fragen"],
        ["Kontakt", "/perpost-kundenservice/"],
      ],
    },
    {
      h: "Rechtliches",
      l: [
        ["Impressum", "/perpost-impressum/"],
        ["Datenschutz", `${BRIEF_ORIGIN}/datenschutz`],
        ["AGB", `${BRIEF_ORIGIN}/agb`],
        ["Widerrufsrecht", `${BRIEF_ORIGIN}/widerrufsrecht`],
      ],
    },
  ];
  return (
    <footer className="relative mt-24 overflow-hidden">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Logo className="h-9 w-auto" />
            <p className="mt-4 max-w-[280px] text-[14px] leading-relaxed text-ink-2">Briefe online schreiben und per Post versenden. Ohne Drucker, ohne Briefmarke.</p>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-2">{c.h}</div>
              <ul className="mt-4 space-y-2.5">
                {c.l.map(([t, h]) => (
                  <li key={t}>
                    <a href={h} className="group relative text-[15px] text-ink transition hover:text-brand">
                      {t}
                      <span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 text-[13px] text-ink-2">
          <span>© 2026 Tischer &amp; Co GmbH · Clayallee 346A · 14169 Berlin</span>
          <span>Aus Berlin, für ganz Deutschland</span>
        </div>
      </div>
      {/* giant wordmark, cropped by the page edge */}
      <div aria-hidden className="pointer-events-none mt-6 select-none overflow-hidden">
        <div className="translate-y-[18%] text-center font-[family-name:var(--font-poppins)] text-[27vw] font-bold leading-[0.8] tracking-[-0.028em] text-ink">
          Per<span className="text-brand">Post</span>
        </div>
      </div>
    </footer>
  );
}
