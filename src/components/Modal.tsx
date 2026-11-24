"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/flow";

/**
 * Popup shell: dimmed, blurred page behind; a centred glass sheet on desktop,
 * a bottom sheet on phones. ESC and the backdrop close it.
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
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[500] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={label}>
          <motion.button
            aria-label="Schließen"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-[#1f1e1e]/35 backdrop-blur-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          />
          <motion.div
            className={`relative flex w-full flex-col overflow-hidden rounded-t-[30px] bg-[#f6f3ec]/95 shadow-[0_40px_120px_-30px_rgba(31,30,30,0.55)] ring-1 ring-white/70 backdrop-blur-2xl sm:rounded-[30px] ${
              wide ? "sm:max-w-[980px]" : "sm:max-w-[640px]"
            } ${tall ? "h-[94dvh] sm:h-[88vh]" : "max-h-[92dvh] sm:max-h-[88vh]"}`}
            initial={{ y: "100%", opacity: 0.6, scale: 1 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            {/* grabber on phones */}
            <div className="mx-auto mt-2.5 h-1.5 w-11 shrink-0 rounded-full bg-ink/15 sm:hidden" />
            <button
              onClick={onClose}
              aria-label="Schließen"
              data-cursor="Zu"
              className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-ink shadow-sm ring-1 ring-ink/[0.06] transition hover:rotate-90 hover:bg-white sm:right-4 sm:top-4"
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
