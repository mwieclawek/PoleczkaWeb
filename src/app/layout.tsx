import type { Metadata } from "next";
import { Open_Sans, Poiret_One } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ReservationModalProvider } from "@/components/ReservationModalContext";
import { ReservationModal } from "@/components/ReservationModal";
import { MicrosoftClarity } from "@/components/MicrosoftClarity";
import { CookieBanner } from "@/components/CookieBanner";

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
  metadataBase: new URL("https://bistropoleczka.pl"),
  title: "Poleczka | Bistro Kuchnia Polska — Wrocław",
  description:
    "Poleczka to nowoczesna kuchnia polska we Wrocławiu. Opieramy się na tradycyjnych, lokalnych składnikach, wydobywając z nich pełnię smaku dzięki nowoczesnym technikom kulinarnym.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "Poleczka | Bistro Kuchnia Polska — Wrocław",
    description:
      "Poleczka to nowoczesna kuchnia polska we Wrocławiu. Opieramy się na tradycyjnych, lokalnych składnikach, wydobywając z nich pełnię smaku dzięki nowoczesnym technikom kulinarnym.",
    images: [{ url: "/icon.png" }],
  },
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
      <head>
        {/* Google Consent Mode v2 Default Settings */}
        <Script
          id="google-consent-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'analytics_storage': 'denied',
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied'
              });
            `,
          }}
        />
      </head>
      <body data-clarity-unmask="true" className="min-h-full flex flex-col font-sans">
        <ReservationModalProvider>
          {children}
          <ReservationModal />
        </ReservationModalProvider>

        {/* Google Analytics 4 */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-RDJ9BY67X3"} />

        {/* Microsoft Clarity */}
        <MicrosoftClarity />

        {/* Cookie Consent Banner */}
        <CookieBanner />
      </body>
    </html>
  );
}
