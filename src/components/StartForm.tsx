"use client";

import { useEffect, useState } from "react";
import { openFlow } from "@/lib/flow";
import { CHIPS, readDraft } from "@/lib/starter";

const EXAMPLES = [
  "Ich möchte meinen Handyvertrag zum nächstmöglichen Termin kündigen.",
  "Widerspruch gegen meinen Bescheid vom Jobcenter einlegen.",
  "Meine Mietkaution vom Vermieter zurückfordern.",
  "Einen Weihnachtsbrief an meine Oma schicken.",
];

function useTypewriter() {
  const [out, setOut] = useState("");
  useEffect(() => {
    let alive = true;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await sleep(1400);
      for (let i = 0; alive; i++) {
        const t = EXAMPLES[i % EXAMPLES.length];
        for (let k = 1; k <= t.length && alive; k++) {
          setOut(t.slice(0, k));
          await sleep(26 + Math.random() * 38);
        }
        await sleep(1800);
        for (let k = t.length; k >= 0 && alive; k--) {
          setOut(t.slice(0, k));
          await sleep(11);
        }
        await sleep(300);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  return out;
}

/**
 * Compact entry in the hero. The real form lives in the popup (FlowModal):
 * tapping the field, a chip or "Weiter" opens it.
 */
export default function StartForm() {
  const ghost = useTypewriter();
  const [draft, setDraft] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(readDraft());
  }, []);

  return (
    <div id="start" className="glass scroll-mt-28 rounded-[26px] p-2.5">
      <button
        type="button"
        onClick={() => openFlow()}
        data-cursor="Schreiben"
        className="group flex w-full items-center gap-3 rounded-[19px] bg-white/80 py-2.5 pl-4 pr-2.5 text-left ring-1 ring-white transition hover:bg-white"
        aria-label="Was möchtest du schreiben? Formular öffnen"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[15px] font-bold leading-tight text-ink sm:text-[16px]">Was möchtest du schreiben?</span>
          <span className="mt-0.5 block truncate text-[14.5px] text-ink-2/75">
            {draft || ghost}
            {!draft && <span className="ml-[1px] inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-ink/60" />}
          </span>
        </span>
        <span className="relative grid h-12 shrink-0 place-items-center overflow-hidden rounded-[15px] bg-ink px-4 text-[16px] font-semibold text-accent sm:px-5">
          <span className="absolute inset-0 -translate-x-full bg-black transition-transform duration-500 group-hover:translate-x-0" />
          <span className="relative">Weiter →</span>
        </span>
      </button>
      <div className="mt-2 flex flex-wrap gap-1.5 px-1 pb-0.5">
        {CHIPS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => openFlow(c.starter)}
            className="h-9 rounded-full bg-white/60 px-3.5 text-[14px] font-medium text-ink ring-1 ring-ink/[0.06] transition hover:bg-white"
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
