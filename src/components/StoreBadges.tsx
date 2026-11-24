"use client";

import { track } from "@/lib/analytics";
import { APP_STORE, GOOGLE_PLAY } from "@/lib/content";

/** Both store buttons drawn as one component: identical size, radius and type. */
function StoreButton({ href, label, top, name, icon }: { href: string; label: string; top: string; name: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={label}
      onClick={() => track("app_store_click", { store: name === "App Store" ? "apple" : "google" })}
      data-cursor="Laden"
      className="group relative inline-flex h-12 w-[172px] items-center gap-3 overflow-hidden rounded-full bg-ink pl-1.5 pr-5 text-white shadow-[0_14px_30px_-18px_rgba(31,30,30,0.7)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5"
    >
      <span className="absolute inset-0 -translate-x-full bg-black transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0" />
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 transition-colors duration-300 group-hover:bg-accent group-hover:text-ink">
        {icon}
      </span>
      <span className="relative flex flex-col leading-none">
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/55">{top}</span>
        <span className="mt-[4px] text-[15.5px] font-semibold tracking-[-0.01em] text-white group-hover:text-accent">{name}</span>
      </span>
    </a>
  );
}

const Apple = (
  <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="currentColor" aria-hidden>
    <path d="M16.37 12.6c-.02-2.33 1.9-3.45 1.99-3.5-1.08-1.58-2.77-1.8-3.37-1.82-1.43-.15-2.8.84-3.53.84-.73 0-1.85-.82-3.04-.8-1.56.02-3 .91-3.81 2.31-1.62 2.82-.41 7 1.17 9.29.77 1.12 1.69 2.38 2.89 2.33 1.16-.05 1.6-.75 3-.75s1.8.75 3.03.73c1.25-.02 2.04-1.14 2.8-2.27.88-1.3 1.25-2.56 1.27-2.62-.03-.01-2.43-.93-2.45-3.7zM14.05 5.75c.64-.78 1.07-1.85.95-2.93-.92.04-2.04.61-2.7 1.38-.59.68-1.11 1.78-.97 2.83 1.03.08 2.07-.52 2.72-1.28z" />
  </svg>
);

const Play = (
  <svg viewBox="0 0 24 26" className="h-[17px] w-[16px]" aria-hidden>
    <path d="M1.2.6 13.6 13 1.2 25.4c-.4-.2-.7-.7-.7-1.3V1.9c0-.6.3-1.1.7-1.3z" fill="#4285F4" />
    <path d="M17.7 8.9 13.6 13 1.2.6c.2-.1.5-.1.8 0l15.7 8.3z" fill="#34A853" />
    <path d="M17.7 17.1 2 25.4c-.3.1-.6.1-.8 0L13.6 13l4.1 4.1z" fill="#EA4335" />
    <path d="m22.4 11.5-4.7-2.6L13.6 13l4.1 4.1 4.7-2.6c1-.6 1-2.4 0-3z" fill="#FBBC04" />
  </svg>
);

export default function StoreBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <StoreButton href={APP_STORE} label="PerPost im App Store laden" top="Laden im" name="App Store" icon={Apple} />
      <StoreButton href={GOOGLE_PLAY} label="PerPost bei Google Play laden" top="Jetzt bei" name="Google Play" icon={Play} />
    </div>
  );
}
