"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Download,
  Phone,
  Mail,
  Utensils,
  Coffee,
  Cake,
  Flame,
  Salad,
} from "lucide-react";

type PackageId = "standard" | "biesiada";

interface MenuCategory {
  title: string;
  rule: string;
  icon: React.ReactNode;
  servingType: "jednoporcjowo" | "wieloporcjowo";
  items: string[];
}

interface PackageData {
  id: PackageId;
  name: string;
  price: number;
  duration: string;
  categories: MenuCategory[];
}

const packages: PackageData[] = [
  {
    id: "standard",
    name: "Spotkanie Wigilijne",
    price: 160,
    duration: "2,5 – 3,5 h",
    categories: [
      {
        title: "Przystawka",
        rule: "Wybierz 1 szt. · Serwowana jednoporcjowo",
        icon: <Utensils className="w-5 h-5 text-[#D9A261]" />,
        servingType: "jednoporcjowo",
        items: [
          "Tatar ze śledzia z musztardą francuską, jabłkiem i rzodkiewką",
          "Wytrawna tarta z szalotką, kozim serem, tymiankiem i miodem",
        ],
      },
      {
        title: "Zupa",
        rule: "Wybierz 1 szt. · Serwowana jednoporcjowo",
        icon: <Flame className="w-5 h-5 text-[#D9A261]" />,
        servingType: "jednoporcjowo",
        items: [
          "Barszcz czerwony czysty z uszkami",
          "Barszcz czerwony czysty z pasztecikiem drożdżowym z kapustą i grzybami",
        ],
      },
      {
        title: "Drugie danie",
        rule: "Wybierz 1 szt. · Serwowane jednoporcjowo",
        icon: <Utensils className="w-5 h-5 text-[#D9A261]" />,
        servingType: "jednoporcjowo",
        items: [
          "Pierogi ruskie",
          "Pierogi z kapustą i grzybami",
          "Pierogi z kaszą gryczaną i wędzonym twarogiem",
          "Dorsz w sosie porowym z puree ziemniaczanym",
          "Krokiety z kapustą i grzybami",
          "Krokiety z mięsem i kapustą",
          "Gołąbki z mięsem z sosem pomidorowym lub grzybowym",
          "Gołąbki vege z sosem pomidorowym lub grzybowym",
          "Ryba po grecku z pieczonymi ziemniakami",
          "Polędwiczka wieprzowa w sosie chrzanowym z kluskami śląskimi",
          "Polędwiczka wieprzowa w sosie z zielonego pieprzu z kluskami śląskimi",
          "Bigos w chlebie",
        ],
      },
      {
        title: "Dodatki warzywne",
        rule: "Wybierz 3 szt. · Dodatki serwowane są wieloporcjowo",
        icon: <Salad className="w-5 h-5 text-[#D9A261]" />,
        servingType: "wieloporcjowo",
        items: [
          "Kapusta z grochem",
          "Biała fasola z masłem i rozmarynem",
          "Buraczki z cebulką na zimno",
          "Buraczki z chrzanem na ciepło",
          "Surówka z kiszonej kapusty",
          "Surówka z marchewki i jabłka",
          "Mix gotowanych warzyw z masłem",
          "Sałatka ziemniaczana",
          "Sałatka ze świeżych warzyw z winagretem",
          "Carpaccio z buraka z sosem balsamicznym i rukolą",
          "Śledzie w śmietanie",
          "Śledzie w porach z orzechami włoskimi",
          "Śledzie z czerwoną cebulą i suszonymi pomidorami",
        ],
      },
      {
        title: "Desery",
        rule: "Wybierz 1 szt. · Serwowane jednoporcjowo",
        icon: <Cake className="w-5 h-5 text-[#D9A261]" />,
        servingType: "jednoporcjowo",
        items: [
          "Makowiec",
          "Piernik",
          "Ciasto marchewkowe",
          "Sernik",
        ],
      },
      {
        title: "Napoje",
        rule: "Wybierz 2 szt.",
        icon: <Coffee className="w-5 h-5 text-[#D9A261]" />,
        servingType: "jednoporcjowo",
        items: [
          "Kompot",
          "Kompot z suszu",
          "Woda z cytryną",
          "Kawa / herbata",
        ],
      },
    ],
  },
  {
    id: "biesiada",
    name: "Spotkanie wigilijne biesiadne",
    price: 200,
    duration: "4 – 5 h",
    categories: [
      {
        title: "Zupa",
        rule: "Wybierz 1 szt. · Zupa serwowana jest wieloporcjowo w wazie",
        icon: <Flame className="w-5 h-5 text-[#D9A261]" />,
        servingType: "wieloporcjowo",
        items: [
          "Barszcz czerwony czysty",
          "Barszcz czerwony czysty z pasztecikiem drożdżowym z kapustą i grzybami",
          "Barszcz z burakami i tłuczonymi ziemniakami",
          "Grzybowa",
        ],
      },
      {
        title: "Drugie danie",
        rule: "Wybierz 3 szt. · Serwowane wieloporcjowo na paterach",
        icon: <Utensils className="w-5 h-5 text-[#D9A261]" />,
        servingType: "wieloporcjowo",
        items: [
          "Pierogi ruskie",
          "Pierogi z kapustą i grzybami",
          "Pierogi z kaszą gryczaną i wędzonym twarogiem",
          "Karp smażony",
          "Krokiety z kapustą i grzybami",
          "Krokiety z mięsem i kapustą",
          "Gołąbki z mięsem z sosem pomidorowym lub grzybowym",
          "Gołąbki vege z sosem pomidorowym lub grzybowym",
          "Ryba po grecku",
          "Polędwiczka wieprzowa w sosie chrzanowym",
          "Polędwiczka wieprzowa w sosie z zielonego pieprzu",
          "Bigos",
        ],
      },
      {
        title: "Dodatki skrobiowe",
        rule: "Wybierz 1–2 szt. · Dodatki skrobiowe serwowane wieloporcjowo na półmiskach",
        icon: <Utensils className="w-5 h-5 text-[#D9A261]" />,
        servingType: "wieloporcjowo",
        items: [
          "Ziemniaki z masłem i koperkiem",
          "Puree ziemniaczane",
          "Kluski śląskie z masłem i szczypiorkiem",
          "Frytki",
        ],
      },
      {
        title: "Dodatki warzywne",
        rule: "Wybierz 3 szt. · Dodatki warzywne serwowane wieloporcjowo na półmiskach",
        icon: <Salad className="w-5 h-5 text-[#D9A261]" />,
        servingType: "wieloporcjowo",
        items: [
          "Kapusta z grochem",
          "Biała fasola z masłem i rozmarynem",
          "Buraczki z cebulką na zimno",
          "Buraczki z chrzanem na ciepło",
          "Surówka z kiszonej kapusty",
          "Surówka z marchewki i jabłka",
          "Mix gotowanych warzyw z masłem",
          "Sałatka ziemniaczana",
          "Sałatka ze świeżych warzyw z winagretem",
          "Carpaccio z buraka z sosem balsamicznym i rukolą",
          "Śledzie w śmietanie",
          "Śledzie w porach z orzechami włoskimi",
          "Śledzie z czerwoną cebulą i suszonymi pomidorami",
        ],
      },
      {
        title: "Zakąski",
        rule: "Wybierz 5 szt. · Po 1 sztuce z każdej wybranej pozycji na osobę",
        icon: <Utensils className="w-5 h-5 text-[#D9A261]" />,
        servingType: "wieloporcjowo",
        items: [
          "Paszteciki drożdżowe z kapustą i grzybami",
          "Paszteciki drożdżowe z pieczarkami i serem",
          "Paszteciki z ciasta francuskiego ze szpinakiem i fetą",
          "Daktyle w bekonie",
          "Tartaletki z serkiem śmietankowym i grzybami na maśle",
          "Tartaletki z gruszką i serem z niebieską pleśnią",
          "Koreczki z camembertem i figą",
          "Kulki twarogowe z burakiem i orzechem włoskim",
          "Kanapeczki z serkiem śmietankowym i łososiem",
          "Kanapeczki ze śledziem, burakiem i cebulą czerwoną",
          "Jaja faszerowane",
          "Sakiewki z ciasta filo z camembertem i pesto pietruszkowym",
          "Sakiewki z ciasta filo z karmelizowaną cebulą i serem z niebieską pleśnią",
          "Kutia w tartaletce z ciasta filo",
        ],
      },
      {
        title: "Desery",
        rule: "Wybierz 2 szt. · Po 2 kawałki na osobę. Serwowane na paterach",
        icon: <Cake className="w-5 h-5 text-[#D9A261]" />,
        servingType: "wieloporcjowo",
        items: [
          "Makowiec",
          "Piernik",
          "Ciasto marchewkowe",
          "Sernik",
        ],
      },
      {
        title: "Napoje",
        rule: "Wybierz 2 szt.",
        icon: <Coffee className="w-5 h-5 text-[#D9A261]" />,
        servingType: "jednoporcjowo",
        items: [
          "Kompot",
          "Kompot z suszu",
          "Woda z cytryną",
          "Kawa / herbata",
        ],
      },
    ],
  },
];

export default function OfertaWigilijnaClient() {
  const [activePkg, setActivePkg] = useState<PackageId>("standard");

  const current = packages.find((p) => p.id === activePkg) || packages[0];

  return (
    <div className="min-h-screen bg-[#FFFDF6] text-[#2D151E]">
      {/* Top accent bar */}
      <div className="h-1.5 bg-[#960C3F] shadow-sm shrink-0" />

      {/* Hero Section - Full width max-w-7xl like About */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 border-b border-[#960C3F]/10 bg-gradient-to-b from-[#960C3F]/[0.04] via-transparent to-[#FFFDF6]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block rounded-full bg-[#960C3F]/10 border border-[#960C3F]/20 px-4 py-1.5 text-xs md:text-sm font-semibold text-[#960C3F] uppercase tracking-wider mb-6">
            Bistro Poleczka · Oferta Świąteczna
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#960C3F] mb-6 leading-[1.08]">
            Spotkania Wigilijne <span className="text-[#CA5254]">2026</span>
          </h1>

          <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-[#960C3F]/80 leading-relaxed mb-6 font-light">
            Świętuj Boże Narodzenie w Bistro Poleczka. Przygotowaliśmy dwa warianty menu wigilijnego z tradycyjnymi potrawami przygotowywanymi od serca z lokalnych i sezonowych składników.
          </p>

          <p className="text-sm md:text-base font-semibold text-[#960C3F] mb-10 bg-[#960C3F]/5 inline-block px-6 py-2.5 rounded-full border border-[#960C3F]/15">
            W celu zapytania o wolny termin lub rezerwacji prosimy o przesłanie wiadomości e-mail.
          </p>

          {/* Quick CTA buttons - Email & Phone */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-3xl mx-auto">
            <a
              href="mailto:kontakt@bistropoleczka.pl?subject=Zapytanie%20o%20ofert%C4%99%20wigilijn%C4%85%202026"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#960C3F] px-8 py-4 text-base font-semibold text-[#FFFDF6] shadow-lg shadow-[#960C3F]/25 hover:bg-[#CA5254] hover:shadow-xl transition-all whitespace-nowrap"
            >
              <Mail className="w-5 h-5 text-[#D9A261]" />
              Napisz maila: kontakt@bistropoleczka.pl
            </a>

            <a
              href="/oferta-wigilia-2026.pdf"
              download="Oferta_Wigilia_2026_Bistro_Poleczka.pdf"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#960C3F] px-8 py-4 text-base font-semibold text-[#960C3F] hover:bg-[#960C3F]/5 transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-[#D9A261]" />
              Pobierz ofertę
            </a>

            <a
              href="tel:+48718808708"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-white border border-[#960C3F]/20 px-8 py-4 text-base font-semibold text-[#960C3F] hover:bg-[#FFFDF6] hover:border-[#960C3F]/40 transition-colors shadow-sm whitespace-nowrap shrink-0 min-w-[190px]"
            >
              <Phone className="w-4 h-4 text-[#CA5254] shrink-0" />
              <span>71 880 87 08</span>
            </a>
          </div>
        </div>
      </section>

      {/* Packages Switcher & Cards - Full width max-w-7xl */}
      <section className="py-14 md:py-24 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[#960C3F]">
            Wybierz pakiet
          </h2>
        </div>

        {/* Tab selection - Full width grid across max-w-7xl */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
          {packages.map((pkg) => {
            const isSelected = activePkg === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setActivePkg(pkg.id)}
                className={`text-left p-6 sm:p-8 rounded-3xl border-2 transition-all ${
                  isSelected
                    ? "bg-white border-[#960C3F] shadow-xl shadow-[#960C3F]/10 ring-2 ring-[#960C3F]/20"
                    : "bg-white/60 border-[#960C3F]/15 hover:border-[#960C3F]/40 hover:bg-white"
                }`}
              >
                <h3 className="text-2xl sm:text-3xl font-heading font-bold text-[#960C3F]">
                  {pkg.name}
                </h3>
                <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 pt-3 border-t border-[#960C3F]/10">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#960C3F]">
                      {pkg.price} zł
                    </span>
                    <span className="text-sm font-medium text-[#960C3F]/60">
                      / osoba
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#960C3F]/80 bg-[#960C3F]/5 px-3.5 py-1.5 rounded-full border border-[#960C3F]/10">
                    <Clock className="w-4 h-4 text-[#D9A261]" />
                    Czas: {pkg.duration}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Package Details - Expansive and Full Width */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full bg-white rounded-3xl border border-[#960C3F]/15 shadow-xl shadow-[#960C3F]/5 p-6 sm:p-10 lg:p-14"
        >
          {/* Header of Active Package */}
          <div className="border-b border-[#960C3F]/10 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-4xl font-heading font-bold text-[#960C3F]">
                {current.name}
              </h3>
            </div>

            <div className="flex items-center gap-4 bg-[#FFFDF6] px-5 py-3 rounded-2xl border border-[#960C3F]/10 shrink-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#960C3F]">
                  {current.price} zł
                </span>
                <span className="text-xs sm:text-sm text-[#960C3F]/60">/ os.</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#960C3F]">
                <Clock className="w-4 h-4 text-[#D9A261]" />
                Czas: {current.duration}
              </span>
            </div>
          </div>

          {/* Categories Grid - Generous width */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {current.categories.map((cat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#960C3F]/10 bg-[#FFFDF6]/60 p-6 md:p-7 transition-all hover:border-[#960C3F]/25 hover:bg-[#FFFDF6]"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#960C3F]/10 text-[#960C3F]">
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-heading font-bold text-[#960C3F]">
                        {cat.title}
                      </h4>
                      <p className="text-xs sm:text-sm font-medium text-[#CA5254] mt-0.5">
                        {cat.rule}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[11px] uppercase font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      cat.servingType === "jednoporcjowo"
                        ? "bg-[#960C3F]/10 text-[#960C3F]"
                        : "bg-[#D9A261]/20 text-[#8F6229]"
                    }`}
                  >
                    {cat.servingType}
                  </span>
                </div>

                <ul className="mt-4 space-y-2.5 border-t border-[#960C3F]/10 pt-4">
                  {cat.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className="text-sm text-[#2D151E] flex items-start gap-2.5 leading-snug"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#CA5254] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Card Actions */}
          <div className="mt-12 pt-6 border-t border-[#960C3F]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-sm text-[#960C3F]/75 text-center sm:text-left">
              W celu zapytania o ten pakiet lub rezerwacji prosimy o kontakt mailowy:{" "}
              <a
                href={`mailto:kontakt@bistropoleczka.pl?subject=Zapytanie%20o%20pakiet%20wigilijny:%20${encodeURIComponent(current.name)}`}
                className="font-bold text-[#960C3F] underline ml-1"
              >
                kontakt@bistropoleczka.pl
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
              <a
                href={`mailto:kontakt@bistropoleczka.pl?subject=Zapytanie%20o%20pakiet%20wigilijny:%20${encodeURIComponent(current.name)}`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-[#960C3F] px-7 py-3.5 text-sm font-semibold text-[#FFFDF6] hover:bg-[#CA5254] transition-all shadow-md shadow-[#960C3F]/20 whitespace-nowrap"
              >
                <Mail className="w-4 h-4 text-[#D9A261]" />
                Wyślij zapytanie mailowe
              </a>
              <a
                href="/oferta-wigilia-2026.pdf"
                download="Oferta_Wigilia_2026_Bistro_Poleczka.pdf"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#960C3F]/20 text-sm font-semibold text-[#960C3F] hover:bg-[#960C3F]/5 transition-colors whitespace-nowrap"
              >
                <Download className="w-4 h-4 text-[#D9A261]" />
                Pobierz ofertę
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Organization Info - 2 cards without alcohol */}
      <section className="py-14 md:py-20 bg-white border-y border-[#960C3F]/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-heading font-bold text-[#960C3F]">
              Informacje organizacyjne
            </h3>
            <p className="text-base text-[#960C3F]/70 mt-2">
              Wszystko, co warto wiedzieć przed rezerwacją spotkania świątecznego
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-3xl border border-[#960C3F]/10 bg-[#FFFDF6] p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#960C3F]/10 text-[#960C3F] flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-6 h-6 text-[#D9A261]" />
              </div>
              <h4 className="font-heading font-bold text-xl text-[#960C3F] mb-3">
                Rezerwacja na wyłączność
              </h4>
              <p className="text-sm text-[#960C3F]/75 leading-relaxed">
                Istnieje możliwość wynajęcia całego lokalu na wyłączność dla Twojej firmy lub rodziny przy odpowiedniej wielkości grupy.
              </p>
            </div>

            <div className="rounded-3xl border border-[#960C3F]/10 bg-[#FFFDF6] p-8 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#960C3F]/10 text-[#960C3F] flex items-center justify-center mx-auto mb-4">
                <Salad className="w-6 h-6 text-[#D9A261]" />
              </div>
              <h4 className="font-heading font-bold text-xl text-[#960C3F] mb-3">
                Diety i alergie
              </h4>
              <p className="text-sm text-[#960C3F]/75 leading-relaxed">
                Poinformuj nas z wyprzedzeniem o diecie wegetariańskiej, wegańskiej, bezglutenowej czy alergiach – chętnie przygotujemy dedykowane porcje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section - Dedicated to Email Inquiry */}
      <section className="py-16 md:py-24 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <div className="rounded-3xl bg-gradient-to-br from-[#960C3F] to-[#740930] p-8 sm:p-14 md:p-16 text-[#FFFDF6] shadow-2xl shadow-[#960C3F]/30 relative overflow-hidden max-w-5xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#D9A261] mb-2">
            Kontakt i rezerwacje
          </span>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4">
            Zapytaj o ofertę wigilijną
          </h3>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#FFFDF6]/85 mb-10 leading-relaxed">
            W celu zapytania o dostępność terminu lub rezerwacji prosimy o kontakt mailowy lub telefoniczny.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:kontakt@bistropoleczka.pl?subject=Zapytanie%20o%20ofert%C4%99%20wigilijn%C4%85%202026"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#D9A261] px-8 py-4 text-base font-bold text-[#2D151E] shadow-lg shadow-[#D9A261]/20 hover:bg-[#e6b377] transition-all whitespace-nowrap"
            >
              <Mail className="w-5 h-5" />
              Napisz maila: kontakt@bistropoleczka.pl
            </a>

            <a
              href="tel:+48718808708"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-white/40 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors whitespace-nowrap shrink-0 min-w-[190px]"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>71 880 87 08</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
