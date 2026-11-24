"use client";

import { useCallback, useEffect, useState } from "react";
import { BRIEF_ORIGIN } from "@/lib/content";
import { OPEN_TOPIC, openFlow, type TopicId } from "@/lib/flow";
import { STARTERS } from "@/lib/starter";
import Modal from "./Modal";

type Topic = {
  eyebrow: string;
  title: string;
  intro: string;
  cases: string[];
  checklist: string[];
  ship: { name: string; price: string; why: string };
  facts: string[];
  sample: { subj: string; lines: string[]; hand?: boolean };
  extra?: { label: string; href: string }[];
  accent: string;
};

const TOPICS: Record<TopicId, Topic> = {
  kuendigung: {
    eyebrow: "Kündigung",
    title: "Vertrag kündigen, sicher und nachweisbar.",
    intro: "Handy, Fitnessstudio, Versicherung oder Abo: beschreib kurz, was du kündigen willst. Wir formulieren daraus eine saubere Kündigung.",
    cases: ["Handyvertrag", "Fitnessstudio", "Strom und Gas", "Zeitung und Abo", "Arbeitsvertrag", "Mietvertrag"],
    checklist: ["Dein Name und deine Anschrift", "Kunden- oder Vertragsnummer", "„fristgerecht zum nächstmöglichen Termin“ oder ein konkretes Datum", "Bitte um schriftliche Bestätigung", "Datum und Unterschrift"],
    ship: { name: "Einschreiben mit Rückschein", price: "7,45 €", why: "Du bekommst die Unterschrift des Empfängers zurück, der stärkste Nachweis für den Zugang." },
    facts: [
      "Arbeits- und Mietverträge brauchen die Schriftform mit eigenhändiger Unterschrift. Viele andere Verträge kannst du auch in Textform kündigen.",
      "Online abgeschlossene Verträge kannst du seit Juli 2022 auch über den Kündigungsbutton beenden.",
    ],
    sample: { subj: "Kündigung meines Vertrags", lines: ["Sehr geehrte Damen und Herren,", "hiermit kündige ich meinen Vertrag mit der Kundennummer … fristgerecht zum nächstmöglichen Termin.", "Bitte bestätigen Sie mir die Kündigung schriftlich."] },
    accent: "#cf3b26",
  },
  vermieter: {
    eyebrow: "Miete",
    title: "Klar und schriftlich an den Vermieter.",
    intro: "Ob Mangel, Kaution oder Nebenkosten: ein Brief mit Datum und Frist schafft Klarheit und dokumentiert, was du wann mitgeteilt hast.",
    cases: ["Mangel anzeigen", "Mietkaution zurückfordern", "Nebenkostenabrechnung prüfen", "Mieterhöhung", "Wohnung kündigen"],
    checklist: ["Adresse der Wohnung und deine Kontaktdaten", "Was genau ist das Anliegen, seit wann?", "Eine angemessene Frist zur Erledigung", "Fotos oder Belege als Anlage", "Datum und Unterschrift"],
    ship: { name: "Einschreiben mit Rückschein", price: "7,45 €", why: "Für Fristen und Kündigungen hast du die Unterschrift des Empfängers als Nachweis." },
    facts: [
      "Einwände gegen die Nebenkostenabrechnung musst du in der Regel innerhalb von zwölf Monaten nach Zugang erheben.",
      "Die Kündigung des Mietvertrags braucht die Schriftform mit Unterschrift. Fotos kannst du deinem Brief als Anlage mitschicken.",
    ],
    sample: { subj: "Mangelanzeige", lines: ["Sehr geehrte Damen und Herren,", "in meiner Wohnung ist seit dem … die Heizung defekt.", "Bitte beheben Sie den Mangel bis zum …"] },
    accent: "#8a5a2b",
  },
  versicherung: {
    eyebrow: "Versicherung",
    title: "Schaden melden, Fragen klären, Vertrag beenden.",
    intro: "Beschreib, was passiert ist oder was du klären möchtest. Wir bringen es in eine Form, die die Sachbearbeitung schnell zuordnen kann.",
    cases: ["Schaden melden", "Unterlagen nachreichen", "Vertrag kündigen", "Beitrag oder Abrechnung", "Adresse ändern"],
    checklist: ["Versicherungs- oder Schadennummer", "Datum und Ort des Ereignisses", "Kurze, sachliche Schilderung", "Belege oder Fotos als Anlage", "Datum und Unterschrift"],
    ship: { name: "Einwurf-Einschreiben", price: "5,45 €", why: "Die Zustellung in den Briefkasten wird dokumentiert, gut für Meldungen mit Frist." },
    facts: ["Einen Schaden solltest du so schnell wie möglich melden, viele Verträge verlangen eine unverzügliche Meldung.", "Nach einer Beitragserhöhung hast du oft ein Sonderkündigungsrecht."],
    sample: { subj: "Schadensmeldung", lines: ["Sehr geehrte Damen und Herren,", "unter der Versicherungsnummer … melde ich Ihnen einen Schaden vom …", "Fotos und Belege liegen bei."] },
    accent: "#3b5a7a",
  },
  persoenlich: {
    eyebrow: "Herzlich",
    title: "Eigene Worte. Als echter Brief.",
    intro: "Zum Geburtstag, zu Weihnachten oder einfach so: dein Brief wird in Farbe gedruckt und landet als echte Post im Briefkasten.",
    cases: ["Geburtstag", "Weihnachten", "Danke sagen", "Für Oma und Opa", "Einfach so"],
    checklist: ["Eine persönliche Anrede", "Eine Erinnerung oder ein Erlebnis", "Was du dir für sie oder ihn wünschst", "Ein Foto, wenn du magst", "Ein Gruß mit deinem Namen"],
    ship: { name: "Brief", price: "2,50 €", why: "Gedruckt in Farbe, auch ins Ausland zum selben Preis." },
    facts: ["Farbdruck ist immer inklusive, Fotos kommen in voller Farbe an.", "Jede weitere Seite kostet nur 0,25 €."],
    sample: { subj: "Liebe Oma,", lines: ["ich denk so oft an dich und wollte dir einfach mal schreiben …"], hand: true },
    extra: [
      { label: "Brief mit Foto versenden", href: `${BRIEF_ORIGIN}/brief-mit-foto?source_page=%2F&cta_id=home_brief_mit_foto` },
      { label: "Herzliche Briefe", href: "/herzliche-briefe/" },
    ],
    accent: "#b4483a",
  },
};

export default function TopicModal() {
  const [id, setId] = useState<TopicId | null>(null);
  useEffect(() => {
    const on = (e: Event) => setId((e as CustomEvent<{ id: TopicId }>).detail.id);
    window.addEventListener(OPEN_TOPIC, on);
    return () => window.removeEventListener(OPEN_TOPIC, on);
  }, []);
  const close = useCallback(() => setId(null), []);
  const t = id ? TOPICS[id] : null;

  return (
    <Modal open={!!t} onClose={close} label={t?.title ?? "Thema"} wide>
      {t && id && (
        <div className="grid min-h-0 overflow-y-auto lg:grid-cols-[1.05fr_0.95fr]">
          {/* left: guidance */}
          <div className="px-5 pb-6 pt-4 sm:px-9 sm:pb-9 sm:pt-9">
            <div className="text-[11.5px] font-semibold uppercase tracking-[0.2em]" style={{ color: t.accent }}>
              {t.eyebrow}
            </div>
            <h3 className="mt-2 pr-10 font-display text-[28px] font-black leading-[1.04] tracking-[-0.02em] text-ink sm:text-[36px]">{t.title}</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{t.intro}</p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {t.cases.map((c) => (
                <span key={c} className="rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-ink ring-1 ring-ink/[0.07]">
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-7 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-2">Das gehört in deinen Brief</div>
            <ul className="mt-3 space-y-2.5">
              {t.checklist.map((c) => (
                <li key={c} className="flex items-start gap-3 text-[15px] leading-snug text-ink">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-[10px] text-accent">✓</span>
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-[20px] bg-ink p-5 text-white">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Unser Tipp zur Versandart</div>
              <div className="mt-2 flex items-baseline justify-between gap-3">
                <span className="font-display text-[20px] font-bold leading-tight">{t.ship.name}</span>
                <span className="shrink-0 whitespace-nowrap font-display text-[22px] font-black text-accent">{t.ship.price}</span>
              </div>
              <p className="mt-1.5 text-[14px] leading-relaxed text-white/70">{t.ship.why}</p>
            </div>

            <div className="mt-6 space-y-2.5">
              {t.facts.map((f) => (
                <p key={f} className="flex gap-3 text-[14px] leading-relaxed text-ink-2">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: t.accent }} />
                  {f}
                </p>
              ))}
            </div>
            {t.extra && (
              <div className="mt-5 flex flex-wrap gap-2">
                {t.extra.map((x) => (
                  <a key={x.label} href={x.href} className="rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-ink ring-1 ring-ink/10 transition hover:ring-ink/30">
                    {x.label} →
                  </a>
                ))}
              </div>
            )}
            <p className="mt-6 text-[12px] text-ink-2/70">Allgemeine Hinweise, sie ersetzen keine Rechtsberatung im Einzelfall.</p>
          </div>

          {/* right: the letter you will start with */}
          <div className="relative overflow-hidden border-t border-ink/[0.06] bg-[radial-gradient(80%_70%_at_50%_30%,rgba(247,207,112,0.45),transparent_70%)] px-5 pb-7 pt-7 sm:px-9 lg:sticky lg:top-0 lg:self-start lg:border-l lg:border-t-0 lg:pt-20">
            <div className="mx-auto max-w-[380px] rotate-[-1.5deg] rounded-[8px] bg-paper p-6 shadow-[0_30px_60px_-30px_rgba(31,30,30,0.5)] ring-1 ring-ink/[0.04]">
              <div className="text-[10px] text-ink-2/70 underline decoration-ink/15">Max Muster · Beispielstraße 1 · 12345 Musterstadt</div>
              <div className={`mt-5 ${t.sample.hand ? "font-hand text-[26px]" : "text-[15px] font-bold"} leading-tight`} style={t.sample.hand ? { color: t.accent } : undefined}>
                {t.sample.subj}
              </div>
              <div className={`mt-3 space-y-2 ${t.sample.hand ? "font-hand text-[19px] leading-snug text-ink" : "text-[13.5px] leading-relaxed text-ink"}`}>
                {t.sample.lines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="h-[5px] w-[88%] rounded bg-ink/[0.08]" />
                <div className="h-[5px] w-[66%] rounded bg-ink/[0.08]" />
              </div>
              <div className="mt-5 font-hand text-[24px] text-[#24387a]">Max Muster</div>
            </div>
            <div className="mx-auto mt-7 max-w-[380px]">
              <button
                onClick={() => {
                  setId(null);
                  setTimeout(() => openFlow(STARTERS[id]), 260);
                }}
                data-cursor="Los"
                className="group relative flex h-[58px] w-full items-center justify-center gap-2 overflow-hidden rounded-[18px] bg-ink text-[17px] font-semibold text-accent"
              >
                <span className="absolute inset-0 -translate-x-full bg-black transition-transform duration-500 group-hover:translate-x-0" />
                <span className="relative">Mit diesem Anfang starten</span>
                <span className="relative transition-transform group-hover:translate-x-1">→</span>
              </button>
              <p className="mt-2.5 text-center text-[12.5px] text-ink-2">Du schreibst in eigenen Worten weiter, wir formulieren mit.</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
