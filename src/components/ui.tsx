"use client";

import { motion } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`text-[12px] font-semibold uppercase tracking-[0.16em] ${dark ? "text-accent" : "text-ink-2"}`}>{children}</p>
  );
}

export function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-[clamp(36px,9vw,72px)] font-black leading-[0.96] tracking-[-0.022em] ${className}`}>{children}</h2>
  );
}

export function Mark({ children }: { children: React.ReactNode }) {
  return (
    <span className="marker">
      <motion.span
        className="marker-ink"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: 0.25, ease }}
      />
      {children}
    </span>
  );
}
