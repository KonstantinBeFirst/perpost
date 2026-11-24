"use client";

import * as THREE from "three";

/** Resolve the real family names next/font generated, so canvas text uses the same fonts. */
function fam(varName: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

export const LETTER_BODY = [
  "Sehr geehrte Damen und Herren,",
  "",
  "hiermit kündige ich meinen Handyvertrag",
  "mit der Kundennummer 4711 0815 fristgerecht",
  "zum nächstmöglichen Termin.",
  "",
  "Bitte bestätigen Sie mir die Kündigung",
  "und das Vertragsende schriftlich.",
  "",
  "Mit freundlichen Grüßen",
];

function paperGrain(ctx: CanvasRenderingContext2D, w: number, h: number, base: string) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 10;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n * 0.8;
  }
  ctx.putImageData(img, 0, 0);
  // a few long fibers
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = "#7a6a48";
  for (let i = 0; i < 90; i++) {
    ctx.beginPath();
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.random() * 40 - 20, y + Math.random() * 40 - 20, x + Math.random() * 60 - 30, y + Math.random() * 60 - 30);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

/**
 * The letter as a live canvas texture. `progress` 0..1 controls how much of the body is "typed",
 * `sig` 0..1 how much of the signature is drawn.
 */
export function makeLetter() {
  const W = 1024;
  const H = Math.round(W * 1.414);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const base = document.createElement("canvas");
  base.width = W;
  base.height = H;
  const bctx = base.getContext("2d")!;
  paperGrain(bctx, W, H, "#fbf8f0");

  const sans = fam("--font-inter", "Helvetica, Arial, sans-serif");
  const hand = fam("--font-hand", "cursive");
  const pop = fam("--font-poppins", "Helvetica, Arial, sans-serif");
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  let last = -1;
  const draw = (progress: number, sig: number) => {
    const key = Math.round(progress * 400) + Math.round(sig * 60) * 1000;
    if (key === last) return;
    last = key;
    ctx.drawImage(base, 0, 0);
    const L = 104;
    // letterhead
    ctx.fillStyle = "#302E2E";
    ctx.font = `700 46px ${pop}`;
    ctx.fillText("PerPost", L, 128);
    ctx.fillStyle = "#F7CF70";
    ctx.fillRect(L, 142, 196, 16);
    ctx.fillStyle = "#302E2E";
    ctx.font = `700 11px ${pop}`;
    ctx.fillText("S M A R T   L E T T E R S", L + 14, 155);
    ctx.fillStyle = "rgba(48,46,46,0.55)";
    ctx.font = `400 19px ${sans}`;
    ctx.textAlign = "right";
    ctx.fillText("Max Muster · Beispielstraße 1", W - L, 116);
    ctx.fillText("12345 Musterstadt", W - L, 142);
    ctx.textAlign = "left";
    // window address
    ctx.fillStyle = "rgba(48,46,46,0.5)";
    ctx.font = `400 16px ${sans}`;
    ctx.fillText("Max Muster · Beispielstraße 1 · 12345 Musterstadt", L, 270);
    ctx.fillRect(L, 276, 430, 1);
    ctx.fillStyle = "#1f1e1e";
    ctx.font = `400 26px ${sans}`;
    ["Beispiel Mobilfunk GmbH", "Kundenservice", "Musterweg 2", "12345 Musterstadt"].forEach((l, i) => ctx.fillText(l, L, 318 + i * 36));
    // date
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(48,46,46,0.7)";
    ctx.font = `400 22px ${sans}`;
    ctx.fillText(new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format(new Date()), W - L, 520);
    ctx.textAlign = "left";
    // subject
    ctx.fillStyle = "#1f1e1e";
    ctx.font = `700 36px ${sans}`;
    ctx.fillText("Kündigung meines Handyvertrags", L, 600);
    // body, typed
    ctx.font = `400 30px ${sans}`;
    const total = LETTER_BODY.join("").length;
    let budget = Math.floor(total * progress);
    let y = 668;
    for (const line of LETTER_BODY) {
      if (budget <= 0) break;
      const shown = line.slice(0, budget);
      ctx.fillText(shown, L, y);
      budget -= line.length;
      if (budget > 0 || shown.length === line.length) y += line ? 46 : 26;
      if (budget <= 0 && progress < 1) {
        // caret
        const w = ctx.measureText(shown).width;
        ctx.fillStyle = "#c4432d";
        ctx.fillRect(L + w + 3, y - 26, 3, 30);
        ctx.fillStyle = "#1f1e1e";
      }
    }
    // signature
    if (sig > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(L - 10, 1090, 520 * sig, 140);
      ctx.clip();
      ctx.fillStyle = "#24387a";
      ctx.font = `600 86px ${hand}`;
      ctx.fillText("Max Muster", L, 1180);
      ctx.restore();
    }
    // footer rule
    ctx.fillStyle = "rgba(48,46,46,0.12)";
    ctx.fillRect(L, H - 110, W - 2 * L, 1);
    ctx.fillStyle = "rgba(48,46,46,0.45)";
    ctx.font = `400 16px ${sans}`;
    ctx.fillText("Gedruckt in Farbe und versendet mit PerPost · perpost.app", L, H - 76);
    tex.needsUpdate = true;
  };
  draw(0, 0);
  return { tex, draw };
}

/** Address side of the envelope, with stamp and Einschreiben label. */
export function makeAddress() {
  const W = 1600;
  const H = 1000;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  paperGrain(ctx, W, H, "#efe5cd");
  const sans = fam("--font-inter", "Helvetica, Arial, sans-serif");
  const disp = fam("--font-poppins", "Helvetica, Arial, sans-serif");
  // sender
  ctx.fillStyle = "#302E2E";
  ctx.font = `600 30px ${sans}`;
  ctx.fillText("Max Muster", 90, 120);
  ctx.font = `400 26px ${sans}`;
  ctx.fillStyle = "rgba(48,46,46,0.7)";
  ctx.fillText("Beispielstraße 1 · 12345 Musterstadt", 90, 160);
  // recipient
  ctx.fillStyle = "#1f1e1e";
  ctx.font = `700 48px ${sans}`;
  ctx.fillText("Beispiel Mobilfunk GmbH", 620, 560);
  ctx.font = `400 44px ${sans}`;
  ["Kundenservice", "Musterweg 2", "12345 Musterstadt"].forEach((l, i) => ctx.fillText(l, 620, 624 + i * 60));
  // Einschreiben label
  ctx.fillStyle = "#fff";
  ctx.fillRect(90, 480, 400, 200);
  ctx.strokeStyle = "rgba(31,30,30,0.2)";
  ctx.lineWidth = 2;
  ctx.strokeRect(90, 480, 400, 200);
  ctx.fillStyle = "#c4432d";
  ctx.font = `800 34px ${disp}`;
  ctx.fillText("EINSCHREIBEN", 116, 528);
  ctx.fillStyle = "#1f1e1e";
  let x = 116;
  while (x < 464) {
    const w = [3, 2, 5, 2, 3, 6][Math.floor(Math.random() * 6)];
    ctx.fillRect(x, 548, w, 80);
    x += w + 3 + Math.floor(Math.random() * 4);
  }
  ctx.font = `500 22px ui-monospace, Menlo, monospace`;
  ctx.fillText("RR 4711 0815 6DE", 116, 660);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Perforated postage stamp. */
export function makeStamp() {
  const W = 360;
  const H = 440;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fffdf6";
  ctx.fillRect(0, 0, W, H);
  // perforation bites
  ctx.globalCompositeOperation = "destination-out";
  for (let x = 0; x <= W; x += 30) {
    ctx.beginPath();
    ctx.arc(x, 0, 10, 0, Math.PI * 2);
    ctx.arc(x, H, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let y = 0; y <= H; y += 30) {
    ctx.beginPath();
    ctx.arc(0, y, 10, 0, Math.PI * 2);
    ctx.arc(W, y, 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#302E2E";
  ctx.fillRect(28, 28, W - 56, H - 56);
  const disp = fam("--font-poppins", "Helvetica, Arial, sans-serif");
  ctx.fillStyle = "#F7CF70";
  ctx.font = `800 26px ${disp}`;
  ctx.fillText("DEUTSCHLAND", 52, 82);
  ctx.font = `800 110px ${disp}`;
  ctx.fillText("5,75", 44, 300);
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = `700 24px ${disp}`;
  ctx.fillText("EINSCHREIBEN", 52, 360);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Red rubber stamp, transparent background. */
export function makeRubber() {
  const W = 900;
  const H = 260;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const disp = fam("--font-poppins", "Helvetica, Arial, sans-serif");
  ctx.strokeStyle = "#cf3b26";
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.roundRect(14, 14, W - 28, H - 28, 26);
  ctx.stroke();
  ctx.fillStyle = "#cf3b26";
  // fit the word inside the frame with even side padding, whatever font is loaded
  const word = "EINSCHREIBEN";
  const maxW = W - 2 * 70;
  let size = 130;
  ctx.font = `800 ${size}px ${disp}`;
  const w0 = ctx.measureText(word).width;
  if (w0 > maxW) size = Math.floor((size * maxW) / w0);
  ctx.font = `800 ${size}px ${disp}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(word, W / 2, H / 2 + size * 0.04);
  // ink wear
  ctx.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 1400; i++) {
    ctx.globalAlpha = Math.random() * 0.8;
    ctx.fillRect(Math.random() * W, Math.random() * H, Math.random() * 4, Math.random() * 3);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Yellow inner liner with the PerPost speed-line pattern. */
export function makeLiner() {
  const W = 800;
  const H = 500;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#F7CF70";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(48,46,46,0.16)";
  ctx.lineCap = "round";
  for (let y = 20; y < H; y += 38) {
    for (let x = (y / 38) % 2 ? -40 : 0; x < W; x += 120) {
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 60, y - 4);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
