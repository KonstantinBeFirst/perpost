"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import StoreBadges from "./StoreBadges";
import { Eyebrow, H2, Mark, Reveal } from "./ui";

const features = [
  { t: "Briefarchiv", d: "Finde deine Briefe jederzeit wieder, übersichtlich in deiner Mailbox." },
  { t: "Kalender", d: "Behalte wichtige Termine und Fristen im Blick." },
  { t: "Inbox", d: "Bearbeite erhaltene Briefe und bereite deine Antwort vor." },
  { t: "Nachweise", d: "Versand-, Zustell- und Empfangsnachweise griffbereit." },
  { t: "Unterschrift", d: "Unterschreib direkt auf dem Handy und füg sie in deinen Brief ein." },
];

const toasts = [
  { k: "✓", t: "Einschreiben zugestellt", s: "Beispiel Mobilfunk GmbH · 09:41", pos: "left-[-6%] top-[18%] sm:left-[-14%]", c: "bg-brand text-white" },
  { k: "!", t: "Frist in 3 Tagen", s: "Widerspruch Jobcenter", pos: "right-[-4%] top-[44%] sm:right-[-16%]", c: "bg-accent text-ink" },
  { k: "✉", t: "Rückschein ist da", s: "Unterschrift: K. Sommer", pos: "left-[-2%] top-[72%] sm:left-[-12%]", c: "bg-ink text-accent" },
];

export default function AppSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const r = useTransform(scrollYProgress, [0, 1], [5, -5]);
  const inView = useInView(ref, { amount: 0.35, once: true });

  return (
    <section id="app" ref={ref} className="relative scroll-mt-20 overflow-hidden pt-28 sm:pt-36">
      <div className="leak leak-sun drift right-[8%] top-[30%] h-[60%] w-[40%] opacity-60" />
      <div className="leak leak-white left-[30%] top-[10%] h-[50%] w-[40%]" />
      <div className="mx-auto grid max-w-[1320px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="relative order-2 mx-auto w-full max-w-[400px] lg:order-1">
          <div className="absolute inset-x-[-15%] top-[10%] aspect-square rounded-full bg-accent/50 blur-3xl" />
          <motion.div style={{ y, rotate: r }} className="relative">
            <div className="relative mx-auto w-[74%] rounded-[46px] bg-ink p-2.5 shadow-[0_60px_90px_-34px_rgba(16,43,35,0.6)]">
              <div className="overflow-hidden rounded-[38px] bg-white">
                <Image src="/app/start.webp" alt="PerPost App Startbildschirm" width={1179} height={2556} className="h-auto w-full" />
              </div>
              <div className="absolute left-1/2 top-4 h-6 w-24 -translate-x-1/2 rounded-full bg-ink" />
            </div>
          </motion.div>
          {toasts.map((t, i) => (
            <motion.div
              key={t.t}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
              transition={{ delay: 0.5 + i * 0.45, type: "spring", stiffness: 260, damping: 18 }}
              className={`glass absolute z-10 flex items-center gap-3 rounded-[18px] py-2.5 pl-2.5 pr-4 ${t.pos}`}
            >
              <span className={`grid h-9 w-9 place-items-center rounded-[11px] text-[15px] font-bold ${t.c}`}>{t.k}</span>
              <span>
                <span className="block text-[13.5px] font-bold text-ink">{t.t}</span>
                <span className="block text-[11.5px] text-ink-2">{t.s}</span>
              </span>
            </motion.div>
          ))}
        </div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <Eyebrow>Die App</Eyebrow>
            <H2 className="mt-4 text-ink">
              Deine Briefpost. <Mark>Alles im Blick.</Mark>
            </H2>
            <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-ink-2">
              Ein Brief muss raus? Starte direkt im Browser. Du willst deine Briefpost organisieren? Die App begleitet dich auch nach dem Versand.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal key={f.t} delay={i * 0.05}>
                <div className="glass h-full rounded-[22px] p-5 transition duration-500 hover:-translate-y-0.5">
                  <div className="font-semibold text-ink">{f.t}</div>
                  <div className="mt-1 text-[14px] leading-relaxed text-ink-2">{f.d}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-8">
              <StoreBadges />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
