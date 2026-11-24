"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { HANDOFF_URL } from "@/lib/content";
import { track } from "@/lib/analytics";
import { OPEN_FLOW } from "@/lib/flow";
import { CHIPS, STARTER_EVENT, applyStarter, readDraft, writeDraft, type StarterDetail } from "@/lib/starter";
import Modal from "./Modal";

const MAX = 1000;
const T = {
  title: "Was möchtest du schreiben?",
  help: "Beschreib kurz dein Anliegen in eigenen Worten. Wir helfen dir beim Formulieren.",
  placeholder: "Zum Beispiel: Ich möchte meinen Handyvertrag zum nächstmöglichen Termin kündigen.",
  submit: "Weiter",
  sending: "Dein Brief wird vorbereitet …",
  after: "Dein Text wird übernommen. Du kannst ihn im nächsten Schritt weiterbearbeiten.",
  empty: "Bitte beschreibe kurz dein Anliegen.",
  tooLong: `Bitte kürze deinen Text auf höchstens ${MAX.toLocaleString("de-DE")} Zeichen.`,
  restored: "Dein zuletzt eingegebener Text wurde wiederhergestellt.",
};

type Rec = { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; start: () => void; stop: () => void };

/**
 * The start of a letter in a popup: the entry form, same rules as the live site.
 * "Weiter" is a native top-level form POST to brief.perpost.app/api/handoff, exactly like
 * the live perpost.app: payment, 3-D Secure and the rest of the flow run in their own tab,
 * never inside a frame. (The hand-off only accepts allowed origins: on preview domains it
 * answers 403 until the owner allows that origin.)
 */
export default function FlowModal() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  // back from brief.perpost.app via the bfcache: make the form usable again
  useEffect(() => {
    const on = (e: PageTransitionEvent) => e.persisted && setSending(false);
    window.addEventListener("pageshow", on);
    return () => window.removeEventListener("pageshow", on);
  }, []);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [listening, setListening] = useState(false);
  const [canDictate, setCanDictate] = useState(false);
  // on-screen keyboard open: drop secondary text so the field and the button keep the room
  const [kb, setKb] = useState(false);
  useEffect(() => {
    const v = window.visualViewport;
    if (!v) return;
    const on = () => setKb(v.height < Math.min(window.screen.height * 0.72, 620));
    on();
    v.addEventListener("resize", on);
    return () => v.removeEventListener("resize", on);
  }, []);
  const ref = useRef<HTMLTextAreaElement>(null);
  const rec = useRef<Rec | null>(null);
  const usedVoice = useRef(false);
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
    usedVoice.current = true;
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
    if (sending) {
      e.preventDefault();
      return;
    }
    // the native POST navigates to brief.perpost.app; the draft stays in sessionStorage
    // so back navigation or a failed hand-off restores the text
    track("letter_start", { source: "popup_form", input: usedVoice.current ? "voice" : "text" });
    setSending(true);
  };

  const close = useCallback(() => setOpen(false), []);

  return (
    <Modal open={open} onClose={close} label="Neuen Brief schreiben">
      {/* entry form */}
      <form
        action={HANDOFF_URL}
        method="post"
        onSubmit={onSubmit}
        noValidate
        className="flex h-full min-h-0 flex-col sm:h-auto"
      >
        {/* scrolling body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-5 sm:px-9 sm:pt-9">
        <div className="text-[11.5px] font-semibold uppercase tracking-[0.2em] text-ink-2">Neuer Brief</div>
        <label htmlFor={ids.field} className="mt-2 block pr-12 font-display text-[27px] font-black leading-[1.02] tracking-[-0.02em] text-ink sm:text-[40px]">
          {T.title}
        </label>
        <p id={ids.help} className={`mt-2 text-[15px] leading-relaxed text-ink-2 ${kb ? "sr-only" : ""}`}>
          {T.help}
        </p>

        <div className="relative mt-5">
          <motion.textarea
            ref={ref}
            id={ids.field}
            name="problem"
            rows={4}
            value={text}
            onChange={(e) => update(e.target.value)}
            placeholder={T.placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={[ids.help, ids.counter, error ? ids.err : null].filter(Boolean).join(" ")}
            animate={error ? { x: [0, -7, 6, -3, 0] } : { x: 0 }}
            transition={{ duration: 0.35 }}
            className={`lined block min-h-[128px] w-full resize-none rounded-[20px] border bg-white px-5 py-4 pr-16 sm:min-h-[196px] text-[17px] leading-[28px] text-ink shadow-[inset_0_1px_3px_rgba(31,30,30,0.05)] outline-none transition placeholder:text-ink-2/50 ${
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
        </div>

        {/* footer stays above the keyboard */}
        <div className="shrink-0 border-t border-ink/[0.07] bg-[#f6f3ec] px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 sm:border-0 sm:bg-transparent sm:px-9 sm:pb-9 sm:pt-2">
        <button
          type="submit"
          data-cursor="Weiter"
          aria-busy={sending || undefined}
          className="group relative flex h-14 w-full sm:h-[60px] items-center justify-center gap-2 overflow-hidden rounded-[20px] bg-ink text-[18px] font-semibold text-accent"
        >
          <span className="absolute inset-0 -translate-x-full bg-black transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0" />
          {sending ? (
            <>
              <motion.svg
                width="26"
                height="18"
                viewBox="0 0 26 18"
                className="relative"
                initial={{ x: -6, rotate: -4 }}
                animate={{ x: [-6, 4, -6], rotate: [-4, 3, -4] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              >
                <rect x="1" y="1" width="24" height="16" rx="2" fill="#fbf9f4" />
                <path d="M1.5 1.5 13 10 24.5 1.5" fill="var(--accent)" stroke="#e2d3aa" />
              </motion.svg>
              <span className="relative">{T.sending}</span>
            </>
          ) : (
            <>
              <span className="relative">{T.submit}</span>
              <span className="relative transition-transform group-hover:translate-x-1">→</span>
            </>
          )}
        </button>
        {!kb && <p className="mt-2 text-center text-[12.5px] leading-snug text-ink-2">{T.after}</p>}
        </div>
      </form>
    </Modal>
  );
}
