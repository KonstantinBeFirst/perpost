"use client";

import { useId } from "react";

/**
 * PerPost Smart Letters, redrawn as vector from the original PNG (678×212 grid).
 * Transparent by construction; `tone="light"` for dark backgrounds.
 */
export default function Logo({ className = "", tone = "dark", title = "PerPost Smart Letters" }: { className?: string; tone?: "dark" | "light"; title?: string }) {
  const ink = tone === "dark" ? "#302E2E" : "#FFFDF7";
  const sun = "#F7CF70";
  const id = `pp-env-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="8 56 630 118" className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="700" height="220">
          <rect x="0" y="0" width="700" height="220" fill="white" />
          {/* gap between flap and body */}
          <path d="M96 58 H256 V73.5 L176 128.5 L96 73.5 Z" fill="black" />
          {/* speed-line slits cutting into the envelope */}
          <path d="M60 104.5 L116 105.8 L116 108.4 L60 108.2 Z" fill="black" />
          <path d="M60 131.6 L112 132.4 L112 135 L60 135 Z" fill="black" />
          <path d="M60 149.4 L128 150 L128 152.8 L60 152.6 Z" fill="black" />
        </mask>
      </defs>

      <g mask={`url(#${id})`} fill={ink}>
        {/* envelope body */}
        <path d="M99 61 H252 V160 Q252 163 249 163 H102.5 Q99.5 163 99.5 160 Z" />
        {/* speed lines, tapering into the envelope */}
        <path d="M12 103.2 C40 101.5 70 98.6 100 96 L100 105.2 C70 105 40 104.4 12 104 Z" />
        <path d="M24 130.4 C50 129.2 76 127 100 125 L100 132.4 C76 132.2 50 131.6 24 131.2 Z" />
        <path d="M27 148.2 C52 147 78 145.2 100 143.4 L100 150.4 C78 150 52 149.4 27 149 Z" />
      </g>
      {/* flap */}
      <path d="M99 61 H252 L176 117 Z" fill={sun} />

      {/* wordmark */}
      <text
        x="263"
        y="133"
        fill={ink}
        style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 700, fontSize: 98, letterSpacing: "-1px" }}
        textLength="364"
        lengthAdjust="spacingAndGlyphs"
      >
        PerPost
      </text>
      {/* tagline bar */}
      <rect x="264" y="145" width="366" height="24" rx="4.5" fill={sun} />
      <text
        x="276"
        y="163"
        fill={tone === "dark" ? ink : "#302E2E"}
        style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif", fontWeight: 700, fontSize: 17 }}
        textLength="348"
        lengthAdjust="spacing"
      >
        SMART LETTERS
      </text>
    </svg>
  );
}
