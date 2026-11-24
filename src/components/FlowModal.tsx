"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { BRIEF_ORIGIN, HANDOFF_URL } from "@/lib/content";
import { OPEN_FLOW } from "@/lib/flow";
import { CHIPS, STARTER_EVENT, applyStarter, readDraft, writeDraft, type StarterDetail } from "@/lib/starter";
import Modal from "./Modal";

const MAX = 1000;
const T = {
  title: "Was möchtest du schreiben?",
  help: "Beschreib kurz dein Anliegen in eigenen Worten. Wir helfen dir beim Formulieren.",
  placeholder: "Zum Beispiel: Ich möchte meinen Handyvertrag zum nächstmöglichen Termin kündigen.",
  submit: "Weiter",
  after: "Dein Text wird übernommen. Du kannst ihn im nächsten Schritt weiterbearbeiten.",
  empty: "Bitte beschreibe kurz dein Anliegen.",
  tooLong: `Bitte kürze deinen Text auf höchstens ${MAX.toLocaleString("de-DE")} Zeichen.`,
  restored: "Dein zuletzt eingegebener Text wurde wiederhergestellt.",
};

type Rec = { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; start: () => void; stop: () => void };

/**
 * The whole start of a letter in one popup: the entry form (same rules as the live site),
 * then the PerPost app itself inside the same sheet. The form posts into the iframe, so the
 * visitor never leaves perpost.app. (The hand-off only accepts allowed origins: on preview
 * domains the app answers 403 until the owner allows that origin.)
 */
export default function FlowModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "app">("form");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [listening, setListening] = useState(false);
  const [canDictate, setCanDictate] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const rec = useRef<Rec | null>(null);
  const ids = { field: useId(), help: useId(), err: useId(), counter: useId() };

  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setText(draft);
      setRestored(true);
    }
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    setCanDictate(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const focusEnd = () =>
    setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      el.setSelectionRange(el.value.length, el.value.length);
    }, 380);

  const show = useCallback((starter?: string) => {
    if (starter) {
      setText((cur) => {
        const next = applyStarter(cur, starter);
        writeDraft(next);
        return next;
      });
    }
    setError(null);
    setStep("form");
    setOpen(true);
    focusEnd();
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => show((e as CustomEvent<{ starter?: string }>).detail?.starter);
    const onStarter = (e: Event) => show((e as CustomEvent<StarterDetail>).detail.starter);
    // every "Brief starten" link (#start) opens the popup instead of jumping
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href="#start"]');
      if (!a) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      show(a.dataset.starter);
    };
    window.addEventListener(OPEN_FLOW, onOpen);
    window.addEventListener(STARTER_EVENT, onStarter);
    window.addEventListener("click", onClick, true);
    if (window.location.hash === "#start") show();
    return () => {
      window.removeEventListener(OPEN_FLOW, onOpen);
      window.removeEventListener(STARTER_EVENT, onStarter);
      window.removeEventListener("click", onClick, true);
    };
  }, [show]);

  const update = (v: string) => {
    setText(v);
    writeDraft(v);
    setError(null);
  };

  const dictate = () => {
    if (listening) return rec.current?.stop();
    const w = window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec };
    const R = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!R) return;
    const r = new R();
    r.lang = "de-DE";
    r.interimResults = false;
    r.onresult = (e) => {
      const said = Array.from(e.results).map((x) => x[0].transcript).join(" ");
      setText((cur) => {
        const next = (cur.trim() ? `${cur.replace(/\s+$/, "")} ${said}` : said).slice(0, MAX);
        writeDraft(next);
        return next;
      });
      setError(null);
    };
    r.onend = () => setListening(false);
    rec.current = r;
    setListening(true);
    r.start();
  };

  const tooLong = text.length > MAX;
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!text.trim()) {
      e.preventDefault();
      setError(T.empty);
      ref.current?.focus();
      return;
    }
    if (tooLong) {
      e.preventDefault();
      setError(T.tooLong);
      ref.current?.focus();
      return;
    }
    // let the native POST go into the iframe below
    setLoading(true);
    setStep("app");
  };

  const close = useCallback(() => setOpen(false), []);

  return (
    <Modal open={open} onClose={close} label="Neuen Brief schreiben" wide={step === "app"} tall={step === "app"}>
      {/* the app lives here once the form is sent */}
      <div className={`${step === "app" ? "flex" : "hidden"} min-h-0 flex-1 flex-col`}>
        <div className="flex items-center gap-3 border-b border-ink/[0.07] px-4 pb-3 pt-3 pr-16 sm:px-6 sm:pt-5">
          <button onClick={() => setStep("form")} className="grid h-9 w-9 place-items-center rounded-full bg-white/80 ring-1 ring-ink/[0.07] transition hover:bg-white" aria-label="Zurück zum Text">
            ←
          </button>
          <div className="flex min-w-0 items-center gap-2 rounded-full bg-ink/[0.05] px-3 py-1.5 font-mono text-[12px] text-ink-2">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            <span className="truncate">brief.perpost.app</span>
          </div>
          <a href={BRIEF_ORIGIN} target="_blank" rel="noopener" className="ml-auto hidden text-[13px] font-semibold text-ink-2 underline decoration-ink/20 underline-offset-4 hover:text-ink sm:inline">
            In neuem Tab öffnen ↗
          </a>
        </div>
        <div className="relative min-h-0 flex-1 bg-white">
          <iframe name="pp-flow" title="PerPost Brief erstellen" className="h-full w-full" onLoad={() => setLoading(false)} allow="microphone; payment; clipboard-write" />
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center bg-[#f6f3ec]">
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    className="relative h-12 w-[74px] rounded-[5px] bg-[#efe5c8] shadow-lg"
                    animate={{ y: [0, -8, 0], rotate: [-3, 2, -3] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 74 48">
                      <path d="M1 1 L37 26 L73 1" fill="var(--sun)" stroke="#e2d3aa" />
                    </svg>
                  </motion.div>
                  <div className="text-[14px] font-semibold text-ink-2">Dein Brief wird vorbereitet …</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* entry form */}
      <form
        action={HANDOFF_URL}
        method="post"
        target="pp-flow"
        onSubmit={onSubmit}
        noValidate
        className={`${step === "form" ? "block" : "hidden"} overflow-y-auto px-5 pb-6 pt-4 sm:px-9 sm:pb-9 sm:pt-9`}
      >
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-ink-2">Neuer Brief</div>
        <label htmlFor={ids.field} className="mt-2 block pr-10 font-display text-[30px] font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-[40px]">
          {T.title}
        </label>
        <p id={ids.help} className="mt-2 text-[15px] leading-relaxed text-ink-2">
          {T.help}
        </p>

        <div className="relative mt-5">
          <motion.textarea
            ref={ref}
            id={ids.field}
            name="problem"
            rows={6}
            value={text}
            onChange={(e) => update(e.target.value)}
            placeholder={T.placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={[ids.help, ids.counter, error ? ids.err : null].filter(Boolean).join(" ")}
            animate={error ? { x: [0, -7, 6, -3, 0] } : { x: 0 }}
            transition={{ duration: 0.35 }}
            className={`lined block w-full resize-none rounded-[20px] border bg-white px-5 py-4 pr-16 text-[17px] leading-[28px] text-ink shadow-[inset_0_1px_3px_rgba(31,30,30,0.05)] outline-none transition placeholder:text-ink-2/50 ${
              error ? "border-stamp" : "border-ink/[0.08] focus:border-ink/30"
            }`}
          />
          {canDictate && (
            <button
              type="button"
              onClick={dictate}
              aria-label={listening ? "Aufnahme beenden" : "Anliegen diktieren"}
              className={`absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full transition ${
                listening ? "bg-stamp text-white" : "bg-ink text-accent hover:scale-105"
              }`}
            >
              {listening && <span className="absolute inset-0 animate-ping rounded-full bg-stamp/40" />}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="relative">
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
            </button>
          )}
        </div>
        <input type="hidden" name="ui_lang" value="de" />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {CHIPS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setText((cur) => {
                  const next = applyStarter(cur, c.starter);
                  writeDraft(next);
                  return next;
                });
                setError(null);
                focusEnd();
              }}
              className="h-10 rounded-full bg-white px-4 text-[14.5px] font-medium text-ink ring-1 ring-ink/[0.08] transition hover:ring-ink/25"
            >
              {c.label}
            </button>
          ))}
          <span id={ids.counter} aria-live="polite" className={`ml-auto text-[12.5px] tabular-nums ${tooLong ? "text-stamp" : "text-ink-2/70"}`}>
            {text.length.toLocaleString("de-DE")} / {MAX.toLocaleString("de-DE")} Zeichen
          </span>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p id={ids.err} role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden pt-3 text-[15px] font-semibold text-stamp">
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {restored && !error && <p className="pt-3 text-[13px] text-ink-2">{T.restored}</p>}

        <button type="submit" data-cursor="Weiter" className="group relative mt-6 flex h-[60px] w-full items-center justify-center gap-2 overflow-hidden rounded-[20px] bg-ink text-[18px] font-semibold text-accent">
          <span className="absolute inset-0 -translate-x-full bg-black transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0" />
          <span className="relative">{T.submit}</span>
          <span className="relative transition-transform group-hover:translate-x-1">→</span>
        </button>
        <p className="mt-2.5 text-center text-[13px] text-ink-2">{T.after}</p>

        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-ink/[0.07] pt-5 text-center text-[12px] leading-snug text-ink-2">
          <div>
            <b className="block font-display text-[18px] text-ink">2,50 €</b>inkl. Porto
          </div>
          <div>
            <b className="block font-display text-[18px] text-ink">Farbe</b>ohne Aufpreis
          </div>
          <div>
            <b className="block font-display text-[18px] text-ink">Bis 17 Uhr</b>werktags am selben Tag gedruckt
          </div>
        </div>
      </form>
    </Modal>
  );
}
