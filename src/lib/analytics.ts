// Landing events, same names as perpost-home (lib/analytics.ts). Pushed to the dataLayer
// only. PRIVACY RULE: never pass input text, addresses or other personal data, only
// categorical values.

export type LandingEvent = "letter_start" | "app_store_click" | "b2b_click" | "price_view" | "chatgpt_click";

type Params = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: LandingEvent, params: Params = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}
