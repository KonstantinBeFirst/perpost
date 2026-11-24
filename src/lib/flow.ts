"use client";

// Window events that open the popups from anywhere on the page.
export const OPEN_FLOW = "pp:open-flow";
export const OPEN_TOPIC = "pp:open-topic";

export type TopicId = "kuendigung" | "vermieter" | "versicherung" | "persoenlich";

export function openFlow(starter?: string) {
  window.dispatchEvent(new CustomEvent<{ starter?: string }>(OPEN_FLOW, { detail: { starter } }));
}
export function openTopic(id: TopicId) {
  window.dispatchEvent(new CustomEvent<{ id: TopicId }>(OPEN_TOPIC, { detail: { id } }));
}

type LenisLike = { stop: () => void; start: () => void };
export function lockScroll(on: boolean) {
  const l = (window as unknown as { __lenis?: LenisLike }).__lenis;
  if (on) {
    l?.stop();
    document.documentElement.style.overflow = "hidden";
  } else {
    l?.start();
    document.documentElement.style.overflow = "";
  }
}
