import type { Metadata } from "next";
import ZamowOnlineClient from "./ZamowOnlineClient";

export const metadata: Metadata = {
  title:
    "Zamów online z dostawą lub odbiorem osobistym | Bistro Poleczka — Wrocław",
  description:
    "Zamów domowe dania kuchni polskiej online z Bistro Poleczka we Wrocławiu (ul. Jaracza 77B, Ołbin / Śródmieście). Szybka dostawa lub odbiór osobisty w lokalu.",
  alternates: {
    canonical: "https://bistropoleczka.pl/zamow-online",
  },
  openGraph: {
    title:
      "Zamów online z dostawą lub odbiorem osobistym | Bistro Poleczka — Wrocław",
    description:
      "Autorska kuchnia polska z dostawą lub odbiorem osobistym we Wrocławiu (Śródmieście / Ołbin, ul. Stefana Jaracza 77B).",
    url: "https://bistropoleczka.pl/zamow-online",
    siteName: "Bistro Poleczka",
    locale: "pl_PL",
    type: "website",
  },
};

export default function ZamowOnlinePage() {
  return <ZamowOnlineClient />;
}
