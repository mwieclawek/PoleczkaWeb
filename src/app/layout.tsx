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
  title:
    "Bistro Poleczka — Kuchnia Polska Wrocław | ul. Jaracza 77B (Ołbin / Śródmieście)",
  description:
    "Bistro Poleczka przy ul. Jaracza 77B we Wrocławiu (Ołbin / Śródmieście). Autorska kuchnia polska z sezonowych produktów. Sprawdź menu, zamów online lub zarezerwuj stolik.",
  alternates: {
    canonical: "https://bistropoleczka.pl",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title:
      "Bistro Poleczka — Kuchnia Polska Wrocław | ul. Jaracza 77B (Ołbin / Śródmieście)",
    description:
      "Bistro Poleczka przy ul. Jaracza 77B we Wrocławiu (Ołbin / Śródmieście). Autorska kuchnia polska z sezonowych produktów. Sprawdź menu, zamów online lub zarezerwuj stolik.",
    url: "https://bistropoleczka.pl",
    siteName: "Bistro Poleczka",
    locale: "pl_PL",
    type: "website",
    images: [{ url: "/logo.png", alt: "Bistro Poleczka — Kuchnia Polska Wrocław" }],
  },
};

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://bistropoleczka.pl/#restaurant",
  name: "Bistro Poleczka",
  image: "https://bistropoleczka.pl/logo.png",
  url: "https://bistropoleczka.pl",
  telephone: "+48718808708",
  email: "kontakt@bistropoleczka.pl",
  priceRange: "$$",
  servesCuisine: "Kuchnia polska",
  acceptsReservations: true,
  hasMenu: "https://bistropoleczka.pl/#menu",
  description:
    "Bistro Poleczka przy ul. Stefana Jaracza 77B we Wrocławiu (Śródmieście / Ołbin, okolice Mostów Warszawskich i Parku Tołpy). Autorska kuchnia polska z sezonowych, lokalnych produktów.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "ul. Stefana Jaracza 77B",
    addressLocality: "Wrocław",
    addressRegion: "Dolnośląskie",
    postalCode: "50-305",
    addressCountry: "PL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.12819,
    longitude: 17.05718,
  },
  areaServed: [
    { "@type": "Place", name: "Ołbin, Wrocław" },
    { "@type": "Place", name: "Śródmieście, Wrocław" },
    { "@type": "Place", name: "Nadodrze, Wrocław" },
    { "@type": "Place", name: "Zacisze, Wrocław" },
    { "@type": "City", name: "Wrocław" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "12:00",
      closes: "21:30",
    },
  ],
  sameAs: [
    "https://instagram.com/bistro.poleczka",
    "https://www.facebook.com/profile.php?id=61591397017136",
  ],
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
        {/* Schema.org Structured Data for Restaurant */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(restaurantJsonLd),
          }}
        />
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
