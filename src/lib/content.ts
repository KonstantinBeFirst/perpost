export const BRIEF_ORIGIN = "https://brief.perpost.app";
export const HANDOFF_URL = `${BRIEF_ORIGIN}/api/handoff`;
export const APP_STORE = "https://apps.apple.com/de/app/perpost-smart-letters/id6747445910";
export const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.perpost.app";
export const CHATGPT = "https://chatgpt.com/plugins/plugin_asdk_app_6adf700ba738819183969470604bc255";
export const B2B = "https://b2b.perpost.app";

export const nav = [
  { label: "So funktioniert’s", href: "#so-funktionierts" },
  { label: "Preise", href: "#preise" },
  { label: "Die App", href: "#app" },
  { label: "Kündigen", href: `${BRIEF_ORIGIN}/kuendigen` },
  { label: "Aktuelles", href: "/aktuelles/" },
];

export const chips = [
  { label: "Kündigung", text: "Ich möchte meinen Handyvertrag zum nächstmöglichen Termin kündigen." },
  { label: "Vermieter", text: "Ich möchte meinem Vermieter einen Mangel in der Wohnung melden." },
  { label: "Versicherung", text: "Ich möchte meiner Versicherung einen Schaden melden." },
];

export const prices = [
  { name: "Brief", sub: "Standardbrief mit Deutsche Post", de: 2.5, abroad: 2.5 },
  { name: "Einwurf-Einschreiben", sub: "Zustellung wird dokumentiert", de: 5.45, abroad: null },
  { name: "Einschreiben", sub: "Übergabe gegen Unterschrift", de: 5.75, abroad: null, featured: true },
  { name: "Einschreiben mit Rückschein", sub: "Unterschrift kommt zu dir zurück", de: 7.45, abroad: null },
] as const;

export const PER_PAGE = 0.25;

export const useCases = [
  {
    title: "Vertrag kündigen",
    text: "Formuliere deine Kündigung und bring sie auf den Postweg.",
    prompt: "Ich möchte meinen Vertrag zum nächstmöglichen Termin kündigen.",
    tag: "Kündigung",
  },
  {
    title: "An den Vermieter schreiben",
    text: "Mangel, Nebenkosten oder Kaution: beschreibe dein Anliegen.",
    prompt: "Ich möchte meinem Vermieter schreiben, weil ",
    tag: "Miete",
  },
  {
    title: "Versicherung kontaktieren",
    text: "Frage stellen, Angaben nachreichen oder Mitteilung formulieren.",
    prompt: "Ich möchte meiner Versicherung mitteilen, dass ",
    tag: "Versicherung",
  },
  {
    title: "Persönlicher Brief",
    text: "Eigene Worte, als echter Brief zugestellt.",
    prompt: "Ich möchte einen persönlichen Brief schreiben an ",
    tag: "Herzlich",
  },
];

export const faq = [
  {
    q: "Wie kann ich einen Brief online versenden?",
    a: "Du schreibst oder diktierst deinen Brief im Browser oder in der App und prüfst die PDF-Vorschau. Nach der Zahlung drucken und kuvertieren wir den Brief und übergeben ihn der Deutschen Post. Ein Standardbrief innerhalb Deutschlands kostet ab 2,50 €.",
  },
  {
    q: "Brauche ich einen Drucker oder Briefmarken?",
    a: "Nein. Du erstellst deinen Brief mit dem Handy oder Computer. Druck, Kuvertierung und postalische Beförderung übernehmen unsere Versandpartner.",
  },
  {
    q: "Muss ich die App installieren?",
    a: "Nein. Du kannst direkt im Browser starten. Die App bietet dir zusätzlich Funktionen zur Organisation deiner Briefpost.",
  },
  {
    q: "Was ist im Preis enthalten?",
    a: "Die erste Seite, Farbdruck, Kuvertierung und das Porto der gewählten Versandart. Die Preise enthalten die Mehrwertsteuer. Jede weitere Seite kostet bei Sendungen mit der Deutschen Post 0,25 €.",
  },
  {
    q: "Wann wird mein Brief verarbeitet?",
    a: "Die Übertragung des bestellten Briefs erfolgt sofort. Druck und Kuvertierung erfolgen Montag bis Freitag von 8 bis 17 Uhr, ausgenommen Feiertage. Außerhalb dieser Zeiten wird der Auftrag im nächsten Verarbeitungsfenster bearbeitet.",
  },
  {
    q: "Wie lange dauert die Zustellung?",
    a: "Bei der Deutschen Post erreicht ein Inlandsbrief sein Ziel in der Regel am zweiten Werktag nach Einlieferung, ein Einschreiben in der Regel am nächsten Werktag. Auslandslaufzeiten hängen vom Zielland ab. Es handelt sich um Regellaufzeiten, nicht um garantierte Termine.",
  },
  {
    q: "Kann ich auf dem Handy unterschreiben?",
    a: "In der App kannst du eine Unterschrift auf dem Bildschirm erfassen und in deinen Brief einfügen. Ob diese Form für dein konkretes Schreiben ausreicht, hängt von dessen Anforderungen ab.",
  },
  {
    q: "Ist Farbdruck teurer?",
    a: "Nein. Farbdruck ist ohne Aufpreis enthalten.",
  },
];

export const euro = (n: number) => n.toFixed(2).replace(".", ",") + " €";
