"use client";

import { BRIEF_ORIGIN } from "@/lib/content";
import { openTopic } from "@/lib/flow";
import { STARTERS } from "@/lib/starter";
import { Eyebrow, H2, Reveal } from "./ui";

/* Four different envelopes, each with its own paper, closure and postal details. */
type V = {
  id: keyof typeof STARTERS;
  title: string;
  text: string;
  tag: string;
  tilt: string;
  back: string;
  pocket: string;
  flap: string;
  edge: string;
  letter: { subj: string; line: string; hand?: boolean };
  deco: React.ReactNode;
};

const Barcode = ({ w = "w-[42%]" }: { w?: string }) => (
  <div className={`${w} rounded-[3px] bg-white px-1.5 py-1 shadow-sm ring-1 ring-ink/10`}>
    <div className="text-[7px] font-black uppercase tracking-wider text-stamp">Einschreiben</div>
    <div className="mt-0.5 h-3 bg-[repeating-linear-gradient(90deg,#1f1e1e_0,#1f1e1e_1px,transparent_1px,transparent_2.5px,#1f1e1e_2.5px,#1f1e1e_3px,transparent_3px,transparent_5px)]" />
  </div>
);
const Stamp = ({ price, bg = "bg-ink", fg = "text-accent", icon }: { price: string; bg?: string; fg?: string; icon?: React.ReactNode }) => (
  <div className="stamp h-[46px] w-[38px] p-[4px] shadow-md [--hole:#d2a873]">
    <div className={`flex h-full w-full flex-col items-center justify-center rounded-[1px] ${bg} ${fg}`}>
      {icon}
      <span className="font-display text-[10px] font-black leading-none">{price}</span>
    </div>
  </div>
);

const VARIANTS: V[] = [
  {
    id: "kuendigung",
    title: "Vertrag kündigen",
    text: "Formuliere deine Kündigung und bring sie auf den Postweg.",
    tag: "Kündigung",
    tilt: "-rotate-[1.6deg]",
    back: "#e7dcbf",
    pocket: "#f3ead2",
    flap: "#ece0c1",
    edge: "#dccda6",
    letter: { subj: "Kündigung meines Vertrags", line: "hiermit kündige ich fristgerecht zum nächstmöglichen Termin …" },
    deco: (
      <>
        <div className="absolute bottom-[30%] left-[8%] w-[44%]">
          <Barcode w="w-full" />
        </div>
        <div className="absolute bottom-[18%] right-[22%] rotate-[-9deg] rounded-[3px] border-2 border-stamp px-1.5 py-[1px] text-[10px] font-black uppercase tracking-wider text-stamp opacity-85 mix-blend-multiply">
          Einschreiben
        </div>
      </>
    ),
  },
  {
    id: "vermieter",
    title: "An den Vermieter schreiben",
    text: "Mangel, Nebenkosten oder Kaution: beschreib dein Anliegen.",
    tag: "Miete",
    tilt: "rotate-[1.2deg]",
    back: "#b98e5e",
    pocket: "#d2a873",
    flap: "#c69a66",
    edge: "#a67c4c",
    letter: { subj: "Mangelanzeige Wohnung", line: "in meiner Wohnung ist seit dem 12.11. die Heizung defekt …" },
    deco: (
      <>
        <div className="absolute bottom-[26%] left-[9%] font-hand text-[17px] leading-tight text-[#3b2a17]">
          An die
          <br />
          Hausverwaltung
        </div>
        <div className="absolute bottom-[34%] right-[9%]">
          <Stamp
            price="2,50"
            bg="bg-[#2f4a3a]"
            fg="text-[#f6e7c6]"
            icon={
              <svg viewBox="0 0 24 24" className="mb-0.5 h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 11l8-7 8 7v9H4z" />
              </svg>
            }
          />
        </div>
      </>
    ),
  },
  {
    id: "versicherung",
    title: "Versicherung kontaktieren",
    text: "Frage stellen, Angaben nachreichen oder Mitteilung formulieren.",
    tag: "Versicherung",
    tilt: "-rotate-[0.8deg]",
    back: "#dfe5ea",
    pocket: "#f4f7f9",
    flap: "#e8eef2",
    edge: "#cdd6dd",
    letter: { subj: "Schadensmeldung", line: "ich melde Ihnen hiermit einen Schaden vom 18.11. …" },
    deco: (
      <>
        {/* address window of a DIN-lang business envelope */}
        <div className="absolute bottom-[22%] left-[8%] h-[30%] w-[50%] rounded-[4px] bg-white/55 ring-1 ring-[#b9c4cc] backdrop-blur-[1px]">
          <div className="space-y-[5px] p-2">
            <div className="h-[4px] w-[72%] rounded bg-ink/40" />
            <div className="h-[4px] w-[56%] rounded bg-ink/25" />
            <div className="h-[4px] w-[64%] rounded bg-ink/25" />
          </div>
        </div>
        <div className="absolute bottom-[34%] right-[8%] rounded-[3px] bg-ink px-1.5 py-1 text-[8px] font-bold uppercase leading-tight tracking-wider text-white/85">
          Entgelt
          <br />
          bezahlt
        </div>
      </>
    ),
  },
  {
    id: "persoenlich",
    title: "Persönlicher Brief",
    text: "Eigene Worte, als echter Brief zugestellt.",
    tag: "Herzlich",
    tilt: "rotate-[1.8deg]",
    back: "#efcfc4",
    pocket: "#f8e2da",
    flap: "#f2d6cc",
    edge: "#e4bcae",
    letter: { subj: "Liebe Oma,", line: "ich denk so oft an dich und wollte dir einfach mal schreiben …", hand: true },
    deco: (
      <>
        <div className="absolute left-1/2 top-[62%] grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_35%,#e0614a,#a8321f)] shadow-[0_4px_10px_rgba(120,30,20,0.35)]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffd9cf">
            <path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10z" />
          </svg>
        </div>
        <div className="absolute bottom-[26%] left-[9%] font-hand text-[19px] leading-none text-[#7a3626]">für dich</div>
        {/* airmail stripes along the bottom edge */}
        <div className="absolute inset-x-0 bottom-0 h-[7px] rounded-b-[10px] bg-[repeating-linear-gradient(135deg,#cf3b26_0_8px,#fff7f3_8px_14px,#2c4f8f_14px_22px,#fff7f3_22px_28px)] opacity-80" />
      </>
    ),
  },
];

export default function UseCases() {
  return (
    <section className="mx-auto max-w-[1320px] px-4 sm:px-6">
      <Reveal>
        <Eyebrow>Was möchtest du erledigen?</Eyebrow>
        <H2 className="mt-4 max-w-[820px] text-ink">Für alles, was schriftlich sein muss.</H2>
      </Reveal>

      <div className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {VARIANTS.map((v, i) => (
          <Reveal key={v.id} delay={i * 0.08}>
            <button type="button" onClick={() => openTopic(v.id)} data-cursor="Öffnen" className="group block w-full text-left">
              <div className="pt-[30%]">
                <div className={`relative aspect-[1.45] w-full transition-transform duration-500 [perspective:900px] group-hover:rotate-0 ${v.tilt}`}>
                  <div className="absolute inset-0 rounded-[10px]" style={{ background: v.back }} />
                  {/* letter */}
                  <div className="absolute inset-x-[7%] top-[14%] z-[1] h-[80%] -translate-y-[24%] rounded-[6px] bg-paper p-[7%] shadow-md transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:-translate-y-[50%]">
                    <div className={`${v.letter.hand ? "font-hand text-[21px] text-stamp" : "text-[12.5px] font-bold text-ink"} leading-tight`}>{v.letter.subj}</div>
                    <div className={`mt-1.5 ${v.letter.hand ? "font-hand text-[16px] leading-tight text-ink" : "text-[11.5px] leading-snug text-ink-2"}`}>{v.letter.line}</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-[4px] w-[90%] rounded bg-ink/10" />
                      <div className="h-[4px] w-[70%] rounded bg-ink/10" />
                    </div>
                  </div>
                  {/* front pocket */}
                  <svg className="absolute inset-0 z-[2] h-full w-full drop-shadow-[0_18px_30px_rgba(31,30,30,0.22)]" viewBox="0 0 145 100" preserveAspectRatio="none">
                    <path d="M0 30 L72.5 62 L145 30 L145 93 Q145 100 138 100 L7 100 Q0 100 0 93 Z" fill={v.pocket} />
                    <path d="M0 100 L60 56 M145 100 L85 56" stroke={v.edge} strokeWidth="0.7" fill="none" />
                  </svg>
                  {/* open flap, standing up behind the letter */}
                  <div className="absolute inset-x-0 top-0 z-0 h-[64%] origin-top [transform:rotateX(180deg)]">
                    <svg className="h-full w-full" viewBox="0 0 145 64" preserveAspectRatio="none">
                      <path d="M0 6 Q0 0 7 0 L138 0 Q145 0 145 6 L78 58 Q72.5 63 67 58 Z" fill={v.flap} stroke={v.edge} strokeWidth="0.6" />
                    </svg>

                  </div>
                  {/* postal details on the pocket */}
                  <div className="absolute inset-0 z-[3]">{v.deco}</div>
                  <div className="absolute inset-x-[7%] bottom-[8%] z-[4] flex items-end justify-between">
                    <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-2 shadow-sm backdrop-blur">{v.tag}</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-accent transition-transform duration-300 group-hover:-rotate-45">→</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 font-display text-[22px] font-extrabold leading-tight tracking-[-0.01em] text-ink">{v.title}</div>
              <div className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{v.text}</div>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <p className="mt-12 text-[15px] text-ink-2">
          Du möchtest ein Foto mitschicken?{" "}
          <a className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink" href={`${BRIEF_ORIGIN}/brief-mit-foto?source_page=%2F&cta_id=home_brief_mit_foto`}>
            Brief mit Foto versenden
          </a>
          . Zum Geburtstag oder zu Weihnachten? Schick{" "}
          <a className="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:decoration-ink" href="/herzliche-briefe/">
            herzliche Briefe an liebe Menschen
          </a>
          .
        </p>
      </Reveal>
    </section>
  );
}
