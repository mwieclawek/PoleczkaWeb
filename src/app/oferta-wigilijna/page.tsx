import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import OfertaWigilijnaClient from "@/components/sections/OfertaWigilijnaClient";

export const metadata: Metadata = {
  title:
    "Wigilie firmowe i spotkania świąteczne Wrocław — Oferta Wigilijna 2026 | Bistro Poleczka",
  description:
    "Zorganizuj spotkanie wigilijne lub wigilię firmową we Wrocławiu (Śródmieście / Ołbin, ul. Jaracza 77B). Dwa pakiety menu (160 zł i 200 zł/os.), tradycyjne potrawy i możliwość wynajmu na wyłączność.",
  alternates: {
    canonical: "https://bistropoleczka.pl/oferta-wigilijna",
  },
  openGraph: {
    title:
      "Wigilie firmowe i spotkania świąteczne Wrocław — Oferta Wigilijna 2026 | Bistro Poleczka",
    description:
      "Spotkania wigilijne dla firm i rodzin we Wrocławiu (ul. Jaracza 77B, Ołbin / Śródmieście). Pakiety 160 zł i 200 zł/os. Sprawdź pełne menu świąteczne.",
    url: "https://bistropoleczka.pl/oferta-wigilijna",
    siteName: "Bistro Poleczka",
    locale: "pl_PL",
    type: "website",
  },
};

export default function OfertaWigilijnaPage() {
  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <OfertaWigilijnaClient />
      </main>
      <Footer />
    </div>
  );
}
