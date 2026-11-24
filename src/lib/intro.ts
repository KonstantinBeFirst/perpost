"use client";

import { useEffect, useState } from "react";

const EVENT = "pp:intro-done";

export function markIntroDone() {
  (window as unknown as { __ppIntro?: boolean }).__ppIntro = true;
  try {
    sessionStorage.setItem("pp-intro", "1");
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function introAlreadyDone() {
  return (
    document.documentElement.classList.contains("no-intro") ||
    !!(window as unknown as { __ppIntro?: boolean }).__ppIntro
  );
}

/** True once the preloader has opened (or immediately when it was skipped this session). */
export function useIntroDone() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (introAlreadyDone()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDone(true);
      return;
    }
    const on = () => setDone(true);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return done;
}

/** Berlin wall clock and the print window (Mon to Fri, 8 to 17 Uhr). */
export function berlinNow(d = new Date()) {
  const p = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  const wd = g("weekday");
  const h = Number(g("hour"));
  const m = Number(g("minute"));
  const s = Number(g("second"));
  const weekday = !["Sa.", "So."].includes(wd);
  const open = weekday && h >= 8 && h < 17;
  const left = open ? 17 * 3600 - (h * 3600 + m * 60 + s) : 0;
  const pad = (n: number) => String(n).padStart(2, "0");
  const countdown = `${pad(Math.floor(left / 3600))}:${pad(Math.floor((left % 3600) / 60))}:${pad(left % 60)}`;
  let next = "morgen 8:00";
  if (weekday && h < 8) next = "heute 8:00";
  else if (wd === "Fr." || wd === "Sa." || wd === "So.") next = "Montag 8:00";
  return { time: `${pad(h)}:${pad(m)}`, open, countdown, next };
}

export function useBerlinClock() {
  const [now, setNow] = useState<ReturnType<typeof berlinNow> | null>(null);
  useEffect(() => {
    const tick = () => setNow(berlinNow());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
