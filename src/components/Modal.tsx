"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/flow";

/**
 * Popup shell.
 * Desktop: a centred glass sheet over a dimmed, blurred page.
 * Phone: a full-screen sheet that follows the *visual* viewport, so it shrinks above the
 * on-screen keyboard instead of hiding the field and the button behind it.
 */
export default function Modal({
  open,
  onClose,
  label,
  children,
  wide = false,
  tall = false,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  wide?: boolean;
  tall?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [phone, setPhone] = useState(false);
  const [vv, setVv] = useState<{ h: number; top: number } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const mq = window.matchMedia("(max-width: 639px)");
    const on = () => setPhone(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const v = window.visualViewport;
    const fit = () => setVv(v ? { h: v.height, top: v.offsetTop } : { h: window.innerHeight, top: 0 });
    fit();
    v?.addEventListener("resize", fit);
    v?.addEventListener("scroll", fit);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      v?.removeEventListener("resize", fit);
      v?.removeEventListener("scroll", fit);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const phoneBox = phone && vv ? { top: vv.top, height: vv.h } : undefined;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 top-0 z-[500] flex h-[100dvh] items-stretch justify-center sm:inset-0 sm:h-auto sm:items-center sm:p-6"
          style={phoneBox}
          role="dialog"
          aria-modal="true"
          aria-label={label}
        >
          <motion.button
            aria-label="Schließen"
            onClick={onClose}
            className="absolute inset-0 hidden cursor-default bg-[#1f1e1e]/35 backdrop-blur-[10px] sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
          <motion.div
            className={`relative flex h-full w-full flex-col overflow-hidden bg-[#f6f3ec] sm:h-auto sm:rounded-[30px] sm:bg-[#f6f3ec]/95 sm:shadow-[0_40px_120px_-30px_rgba(31,30,30,0.55)] sm:ring-1 sm:ring-white/70 sm:backdrop-blur-2xl ${
              wide ? "sm:max-w-[980px]" : "sm:max-w-[640px]"
            } ${tall ? "sm:h-[88vh]" : "sm:max-h-[88vh]"}`}
            initial={phone ? { y: "6%", opacity: 0 } : { y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={phone ? { y: "6%", opacity: 0 } : { y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <button
              onClick={onClose}
              aria-label="Schließen"
              data-cursor="Zu"
              className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-sm ring-1 ring-ink/[0.07] transition hover:rotate-90 sm:right-4 sm:top-4"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
