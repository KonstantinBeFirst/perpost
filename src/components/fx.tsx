"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const FINE = "(hover: hover) and (pointer: fine)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(FINE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
export const useFinePointer = () => useSyncExternalStore(subscribe, () => window.matchMedia(FINE).matches, () => false);

/**
 * Ink dot + trailing ring. [data-cursor="Label"] grows the ring into a yellow seal with the label;
 * over text fields the dot turns into a pen nib.
 */
export function Cursor() {
  const enabled = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const [pen, setPen] = useState(false);
  const [down, setDown] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement;
      const t = el.closest<HTMLElement>("a,button,[data-cursor],label,select");
      setPen(!!el.closest("textarea,input"));
      setHover(!!t);
      setLabel(t?.dataset.cursor ?? null);
      setShown(true);
    };
    const leave = () => setShown(false);
    // pointer events stop at iframes (the app inside the popup): hide ours, the iframe shows its own cursor
    const out = (e: PointerEvent) => {
      const to = e.relatedTarget as HTMLElement | null;
      if (!to || to.tagName === "IFRAME") setShown(false);
    };
    document.addEventListener("pointerout", out);
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", d);
    window.addEventListener("pointerup", u);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerout", out);
      window.removeEventListener("pointerdown", d);
      window.removeEventListener("pointerup", u);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const size = label ? 92 : hover ? 52 : pen ? 0 : 34;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[900] flex items-center justify-center rounded-full"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: shown ? 1 : 0,
          width: size,
          height: size,
          scale: down ? 0.86 : 1,
          backgroundColor: label ? "rgba(241,232,84,1)" : hover ? "rgba(241,232,84,0.35)" : "rgba(241,232,84,0)",
          borderColor: label ? "rgba(18,63,50,0)" : "rgba(18,63,50,0.45)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <span className="absolute inset-0 rounded-full border" style={{ borderColor: "inherit" }} />
        {label && (
          <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} className="relative text-center text-[12px] font-bold uppercase leading-tight tracking-wider text-ink">
            {label}
          </motion.span>
        )}
      </motion.div>
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[901]" style={{ x, y, opacity: shown ? 1 : 0 }}>
        {pen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" className="-translate-x-[3px] -translate-y-[19px] text-brand" fill="currentColor">
            <path d="M3 21l1.6-5.6L15.8 4.2a2 2 0 0 1 2.8 0l1.2 1.2a2 2 0 0 1 0 2.8L8.6 19.4z" />
            <path d="M14.4 5.6l4 4" stroke="var(--accent)" strokeWidth="1.6" />
          </svg>
        ) : (
          <span className="block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand" />
        )}
      </motion.div>
    </>
  );
}

/** Pulls its child toward the pointer. */
export function Magnetic({ children, strength = 0.3, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 16 });
  const y = useSpring(0, { stiffness: 220, damping: 16 });
  return (
    <motion.div
      ref={ref}
      className={className || "inline-block"}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Reading progress as a shipment track, drawn along the bottom edge of the header capsule:
 * a hairline that fills and a small envelope riding on its tip.
 */
export function TrackingBar() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const left = useTransform(p, (v) => `${v * 100}%`);
  const show = useTransform(p, [0, 0.01], [0, 1]);
  return (
    <motion.div aria-hidden style={{ opacity: show }} className="pointer-events-none absolute inset-x-7 bottom-[5px] h-[2px] sm:inset-x-9">
      <div className="absolute inset-0 rounded-full bg-ink/[0.07]" />
      <motion.div className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-ink" style={{ scaleX: p }} />
      <motion.div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left }}>
        <svg width="16" height="11" viewBox="0 0 16 11" className="drop-shadow-[0_1px_1px_rgba(31,30,30,0.25)]">
          <rect x="0.5" y="0.5" width="15" height="10" rx="1.6" fill="#fbf9f4" stroke="#1f1e1e" strokeWidth="1" />
          <path d="M1 1.2 L8 6 L15 1.2" fill="#f7cf70" stroke="#1f1e1e" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/** Splits text into characters that rise in, word-safe for line breaks. */
export function SplitChars({ text, delay = 0, stagger = 0.025, play = true, className = "" }: { text: string; delay?: number; stagger?: number; play?: boolean; className?: string }) {
  let i = 0;
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((w, wi, arr) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {w.split("").map((c) => {
            const d = delay + i++ * stagger;
            return (
              <span key={d} className="-mx-[0.14em] -mt-[0.1em] inline-block overflow-hidden px-[0.14em] pb-[0.1em] pt-[0.1em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%", rotate: 8 }}
                  animate={play ? { y: "0%", rotate: 0 } : undefined}
                  transition={{ duration: 0.85, delay: d, ease: [0.22, 1, 0.36, 1] }}
                >
                  {c}
                </motion.span>
              </span>
            );
          })}
          {wi < arr.length - 1 && <span className="inline-block w-[0.24em]" />}
        </span>
      ))}
    </span>
  );
}
