import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Anton,
  DM_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ma Vie Passionnante — BD par Louise Leroux",
  description:
    "Bande dessinée autobiographique et humoristique par Louise Leroux. Strips publiés sur Instagram.",
  authors: [{ name: "Louise Leroux" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://maviepassionnante.fr"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://maviepassionnante.fr",
    siteName: "Ma Vie Passionnante",
    title: "Ma Vie Passionnante — BD par Louise Leroux",
    description:
      "Bande dessinée autobiographique et humoristique par Louise Leroux.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${cormorant.variable} ${anton.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
