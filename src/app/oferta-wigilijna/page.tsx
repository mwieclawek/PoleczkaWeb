import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import OfertaWigilijnaClient from "@/components/sections/OfertaWigilijnaClient";

export const metadata: Metadata = {
  title: "Oferta Wigilijna 2026 | Bistro Poleczka — Wrocław",
  description:
    "Autorskie menu wigilijne dla firm, przyjaciół i rodzin. Tradycyjne smaki, polskie klasyki i kameralna atmosfera w Bistro Poleczka przy ul. Jaracza 77B we Wrocławiu.",
  openGraph: {
    title: "Oferta Wigilijna 2026 | Bistro Poleczka — Wrocław",
    description:
      "Spotkania wigilijne we Wrocławiu. Pakiety 160 zł i 200 zł/os. Tradycyjna kuchnia polska w nowoczesnym wydaniu.",
    url: "https://bistropoleczka.pl/oferta-wigilijna",
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
