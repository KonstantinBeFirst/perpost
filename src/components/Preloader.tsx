"use client";

import { useEffect, useRef, useState } from "react";
import { markIntroDone } from "@/lib/intro";

/**
 * First visit of the session only (html.no-intro hides it before paint).
 * A stamp draws the PerPost envelope while a big counter runs 000 to 100 and envelopes
 * zip across with speed lines. At 100 a postmark hits the stamp, then the screen opens
 * like an envelope: the top half lifts as a flap, the bottom half drops.
 */
export default function Preloader() {
  const [p, setP] = useState(0);
  const [stage, setStage] = useState<"load" | "stamp" | "open" | "gone">("load");
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.documentElement.classList.contains("no-intro")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStage("gone");
      markIntroDone();
      return;
    }
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const t0 = performance.now();
    const DUR = 950;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / DUR);
      setP(1 - Math.pow(1 - k, 3));
      if (k < 1) raf = requestAnimationFrame(tick);
      else {
        setStage("stamp");
        setTimeout(() => {
          setStage("open");
          markIntroDone();
          html.style.overflow = "";
        }, 380);
        setTimeout(() => setStage("gone"), 1350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      html.style.overflow = "";
    };
  }, []);

  if (stage === "gone") return null;
  const n = Math.round(p * 100);
  const opening = stage === "open";

  return (
    <div ref={root} className="pp-loader fixed inset-0 z-[300]" aria-hidden>
      {/* the two halves of the envelope */}
      <div
        className="absolute inset-x-0 top-0 h-[62%] bg-bg transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)]"
        style={{
          clipPath: "polygon(0 0,100% 0,100% 80%,50% 100%,0 80%)",
          transform: opening ? "translateY(-101%)" : "none",
          transitionDelay: opening ? "60ms" : "0ms",
        }}
      >
        <svg className={`absolute inset-0 h-full w-full transition-opacity duration-200 ${opening ? "opacity-100" : "opacity-0"}`} viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 80 L50 100 L100 80" fill="none" stroke="var(--accent)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" style={{ filter: "drop-shadow(0 0 10px var(--accent))" }} />
        </svg>
      </div>
      <div
        className="absolute inset-x-0 bottom-0 h-[50.5%] bg-bg transition-transform duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)]"
        style={{ transform: opening ? "translateY(101%)" : "none", transitionDelay: opening ? "60ms" : "0ms" }}
      >
        <div className={`absolute inset-x-0 top-0 h-[2px] bg-accent shadow-[0_0_24px_var(--accent)] transition-opacity duration-200 ${opening ? "opacity-100" : "opacity-0"}`} />
      </div>

      {/* content */}
      <div className={`absolute inset-0 transition-all duration-300 ${opening ? "scale-[0.97] opacity-0" : "opacity-100"}`}>
        {/* top progress */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-line">
          <div className="h-full origin-left bg-brand" style={{ transform: `scaleX(${p})` }} />
        </div>

        {/* flying envelopes with speed lines, like the logo */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="pp-fly absolute left-0" style={{ top: `${[18, 34, 66, 80][i]}%`, animationDelay: `${i * 0.28 + 0.05}s`, ["--s" as string]: [0.9, 0.6, 0.75, 0.5][i] }}>
            <Flyer />
          </div>
        ))}

        {/* stamp */}
        <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2">
          <div className="pp-stamp relative grid h-[178px] w-[148px] place-items-center bg-white p-[9px] shadow-[0_30px_60px_-30px_rgba(16,43,35,0.45)] sm:h-[210px] sm:w-[174px]">
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 border border-line bg-paper">
              <svg viewBox="0 0 120 80" className="w-[78%] overflow-visible">
                {/* speed lines */}
                {[22, 34, 46, 58].map((y, i) => (
                  <line
                    key={y}
                    x1={-6 + i * 3}
                    x2={26}
                    y1={y}
                    y2={y}
                    stroke="var(--ink)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset={1 - Math.min(1, Math.max(0, (p - 0.55) * 3))}
                  />
                ))}
                {/* envelope body */}
                <path
                  d="M32 10 H112 V72 H32 Z"
                  fill="var(--ink)"
                  fillOpacity={p > 0.92 ? 1 : 0}
                  stroke="var(--ink)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - Math.min(1, p * 1.25)}
                  style={{ transition: "fill-opacity .3s" }}
                />
                <path
                  d="M32 10 L72 40 L112 10 Z"
                  fill="var(--sun)"
                  fillOpacity={p > 0.92 ? 1 : 0}
                  stroke={p > 0.92 ? "var(--paper)" : "var(--ink)"}
                  strokeWidth="3"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={1 - Math.min(1, Math.max(0, p * 1.4 - 0.2))}
                  style={{ transition: "fill-opacity .3s, stroke .3s" }}
                />
              </svg>
              <div className="font-display text-[15px] font-black tracking-tight text-ink sm:text-[17px]">
                Per<span>Post</span>
              </div>
              <div className="rounded-[3px] bg-sun px-1.5 py-[1px] text-[8px] font-bold uppercase tracking-[0.3em] text-ink">Smart Letters</div>
            </div>
            {/* postmark */}
            <svg
              viewBox="0 0 200 120"
              className={`pointer-events-none absolute -right-[96%] top-[22%] w-[140%] text-ink/70 transition-all duration-150 ${
                stage === "load" ? "scale-[1.6] opacity-0" : "scale-100 opacity-100"
              }`}
              style={{ mixBlendMode: "multiply" }}
            >
              <circle cx="58" cy="60" r="38" fill="none" stroke="currentColor" strokeWidth="3" />
              <circle cx="58" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <text x="58" y="55" textAnchor="middle" fontSize="11" fontWeight="800" fill="currentColor" letterSpacing="1">BERLIN</text>
              <text x="58" y="70" textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">PERPOST</text>
              {[30, 48, 66, 84].map((y) => (
                <path key={y} d={`M104 ${y} q 12 -8 24 0 t 24 0 t 24 0 t 24 0`} fill="none" stroke="currentColor" strokeWidth="3.2" />
              ))}
            </svg>
          </div>
        </div>

        {/* big counter + caption */}
        <div className="absolute inset-x-0 bottom-5 mx-auto flex max-w-[1240px] items-end justify-between gap-4 px-4 sm:bottom-7 sm:px-6">
          <div className="flex items-start font-display font-black leading-[0.8] tracking-[-0.03em] text-ink">
            <span className="text-[26vw] tabular-nums sm:text-[clamp(110px,15vw,220px)]">{String(n).padStart(3, "0")}</span>
            <span className="ml-1 mt-2 text-[8vw] text-brand sm:text-[44px]">%</span>
          </div>
          <div className="hidden pb-2 text-right text-[11px] font-semibold sm:block uppercase leading-relaxed tracking-[0.16em] text-ink-2 sm:text-[12px]">
            Briefe online versenden
            <br />
            <span className="text-ink">Berlin · Deutschland</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Flyer() {
  return (
    <div className="relative flex items-center" style={{ transform: "scale(var(--s))" }}>
      <div className="mr-1 flex flex-col gap-[5px]">
        {[44, 60, 52, 36].map((w, i) => (
          <span key={i} className="h-[3px] rounded-full bg-ink/25" style={{ width: w, marginLeft: 60 - w }} />
        ))}
      </div>
      <div className="relative h-[46px] w-[70px] rounded-[4px] bg-[#efe5c8] shadow-[0_12px_24px_-12px_rgba(16,43,35,0.5)]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 70 46">
          <path d="M1 1 L35 25 L69 1" fill="var(--sun)" stroke="#e2d3aa" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
