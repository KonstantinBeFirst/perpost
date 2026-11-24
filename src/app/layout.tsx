import type { Metadata, Viewport } from "next";
import { Caveat, Fraunces, Manrope, Poppins } from "next/font/google";
import "./globals.css";

const inter = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-inter" });
const display = Fraunces({ subsets: ["latin"], weight: ["400", "600", "700", "900"], style: ["normal", "italic"], variable: "--font-display" });
const serif = Fraunces({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], variable: "--font-serif" });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-poppins" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-hand" });

// Preview build: stays out of Google until it replaces perpost.app.
const allowIndexing = process.env.ALLOW_INDEXING === "true";

export const metadata: Metadata = {
  metadataBase: new URL("https://perpost.app"),
  title: "Brief online versenden ohne Drucker und Briefmarke | PerPost",
  description:
    "Brief mit Handy oder Computer schreiben und per Post versenden. Druck, Umschlag und Porto inklusive, ab 2,50 €. Auch als Einschreiben.",
  robots: allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "Dein Brief. Dein Handy. Ab die Post.",
    description: "Brief online schreiben und per Post versenden. Ab 2,50 € inklusive Porto.",
    type: "website",
    locale: "de_DE",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f2eee6",
  // Android: the keyboard shrinks the page, so popups stay above it
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning className={`${inter.variable} ${display.variable} ${serif.variable} ${hand.variable} ${poppins.variable}`}>
      <head>
        {/* Preloader only once per session; decided before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("pp-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("no-intro")}catch(e){document.documentElement.classList.add("no-intro")}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
