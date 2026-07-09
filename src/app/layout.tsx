import type { Metadata } from "next";
import { Open_Sans, Poiret_One } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const poiretOne = Poiret_One({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poleczka | Bistro Kuchnia Polska — Wrocław",
  description:
    "Poleczka to nowoczesna kuchnia polska we Wrocławiu. Opieramy się na tradycyjnych, lokalnych składnikach, wydobywając z nich pełnię smaku dzięki nowoczesnym technikom kulinarnym.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${openSans.variable} ${poiretOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
