"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { track } from "@/lib/analytics";
import { useBerlinClock, useIntroDone } from "@/lib/intro";
import { Magnetic, TrackingBar } from "./fx";
import Logo from "./Logo";

function LiveChip({ compact = false }: { compact?: boolean }) {
  const c = useBerlinClock();
  return (
    <div
      data-cursor={compact ? undefined : "Live"}
      className="flex h-10 items-center gap-2.5 whitespace-nowrap rounded-full bg-ink/[0.045] pl-3 pr-3.5 text-[12px] font-semibold tracking-wide text-ink-2 ring-1 ring-inset ring-ink/[0.06]"
    >
      <span className="relative flex h-2 w-2">
        {c?.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3fb27f] opacity-70" />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${c?.open ? "bg-[#3fb27f]" : "bg-sun"}`} />
      </span>
      <span className="uppercase tracking-[0.12em] text-ink">Berlin</span>
      <span className="tabular-nums text-ink">{c?.time ?? "--:--"}</span>
      <span className="h-3 w-px bg-line" />
      {c?.open ? (
        <span>
          Heute noch raus <b className="tabular-nums text-ink">{c.countdown}</b>
        </span>
      ) : (
        <span>
          Druck startet <b className="text-ink">{c?.next ?? "8:00"}</b>
        </span>
      )}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const ready = useIntroDone();

  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > 400 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <motion.header
      initial={{ y: -90 }}
      animate={{ y: ready ? 0 : -90 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: ready && !scrolled ? 0.5 : 0 }}
      className="fixed inset-x-0 top-2.5 z-50 px-2.5 sm:top-4 sm:px-5"
    >
      <div className={`glass relative mx-auto flex h-[60px] max-w-[1280px] items-center gap-5 rounded-full pl-5 pr-2 transition-shadow duration-500 sm:h-[68px] sm:pl-7 ${scrolled ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_26px_60px_-26px_rgba(31,30,30,0.45)]" : ""}`}>
        <a href="/" aria-label="PerPost Startseite" className="shrink-0" data-cursor="Start">
          <Logo className="h-[28px] w-auto sm:h-[32px]" />
        </a>
        <nav className="ml-4 hidden items-center gap-0.5 xl:flex">
          {nav.map((n) => (
            <a
              key={n.label}
              href={n.href}
              onClick={n.external ? () => track("b2b_click", { placement: "header" }) : undefined}
              className="group relative whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium text-ink-2 transition hover:bg-white/70 hover:text-ink"
            >
              {n.label}
              {n.external && <span aria-hidden> ↗</span>}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {/* with the full nav (xl) the clock only fits from 2xl on */}
          <div className="hidden lg:block xl:hidden 2xl:block">
            <LiveChip />
          </div>
          <Magnetic className="hidden sm:inline-block">
            <a
              href="#start"
              data-cursor="Los"
              className="group relative inline-flex h-12 items-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-brand px-6 text-[15px] font-semibold text-accent"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
              <span className="relative">Brief starten</span>
              <span className="relative transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </Magnetic>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/70 ring-1 ring-ink/[0.06] xl:hidden"
          >
            <span className="relative block h-3 w-[18px]">
              <span className={`absolute left-0 top-0 h-[2px] w-full rounded bg-ink transition duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-[2px] w-full rounded bg-ink transition duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
        <TrackingBar />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="glass mx-auto mt-2 max-h-[calc(100dvh-90px)] max-w-[1280px] overflow-y-auto rounded-[28px] px-5 pb-8 pt-5 xl:hidden"
          >
            <LiveChip compact />
            <nav className="mt-4 flex flex-col">
              {nav.map((n, i) => (
                <motion.a
                  key={n.label}
                  href={n.href}
                  onClick={() => {
                    if (n.external) track("b2b_click", { placement: "mobile_menu" });
                    setOpen(false);
                  }}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between border-b border-line py-4 font-display text-[30px] font-black tracking-tight text-ink"
                >
                  {n.label}
                  <span className="text-[20px] text-ink-2">{n.external ? "↗" : "→"}</span>
                </motion.a>
              ))}
            </nav>
            <a href="#start" onClick={() => setOpen(false)} className="mt-8 flex h-14 items-center justify-center rounded-[14px] bg-brand text-[17px] font-semibold text-white">
              Brief starten
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
