import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poleczka | Nowoczesna Kuchnia Polska we Wrocławiu",
  description:
    "Poleczka to nowoczesna kuchnia polska we Wrocławiu. Opieramy się na tradycyjnych, lokalnych składnikach, wydobywając z nich pełnię smaku dzięki nowoczesnym technikom kulinarnym. Miejsce stworzone z pasją, gdzie klasyka spotyka się z finezją.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
