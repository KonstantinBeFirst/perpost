// Same contract as perpost-home (lib/starter.ts), so the move into that repo is 1:1.
// A use-case tile asks the hero form to insert a starter text and take focus.
// The form only inserts it while the field is empty.

export const STARTER_EVENT = "pp:starter";

export interface StarterDetail {
  starter: string;
}

export function requestStarter(starter: string): void {
  window.dispatchEvent(new CustomEvent<StarterDetail>(STARTER_EVENT, { detail: { starter } }));
}

/** Only fill an empty field: never overwrite what the user already typed. */
export function applyStarter(current: string, starter: string): string {
  return current.trim() === "" ? starter : current;
}

// Texts as on the live site (perpost-home lib/content/de.ts).
export const STARTERS = {
  kuendigung: "Ich möchte meinen Vertrag mit ",
  vermieter: "Ich möchte meinem Vermieter mitteilen, dass ",
  versicherung: "Ich möchte meiner Versicherung mitteilen, dass ",
  persoenlich: "Ich möchte einen persönlichen Brief an ",
} as const;

export const CHIPS = [
  { id: "kuendigung", label: "Kündigung", starter: STARTERS.kuendigung },
  { id: "vermieter", label: "Vermieter", starter: STARTERS.vermieter },
  { id: "versicherung", label: "Versicherung", starter: STARTERS.versicherung },
] as const;

const DRAFT_KEY = "pp-hero-draft";
export function readDraft(): string {
  try {
    return sessionStorage.getItem(DRAFT_KEY) ?? "";
  } catch {
    return "";
  }
}
export function writeDraft(v: string) {
  try {
    if (v) sessionStorage.setItem(DRAFT_KEY, v);
    else sessionStorage.removeItem(DRAFT_KEY);
  } catch {}
}
