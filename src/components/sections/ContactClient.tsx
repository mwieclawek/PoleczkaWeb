"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface OpeningHourSlot {
  days: string;
  hours: string;
}

export interface ContactData {
  tagline?: string;
  title?: string;
  subtitle?: string;
  addressLabel?: string;
  googleMapsUrl?: string;
  phone?: string;
  phoneClean?: string;
  email?: string;
  openingHours?: OpeningHourSlot[];
  footerNote?: string;
}

export const defaultContactData: Required<ContactData> = {
  tagline: "Kontakt",
  title: "Odwiedź nas",
  subtitle:
    "Znajdziesz nas w samym sercu Wrocławia. Zarezerwuj stolik telefonicznie lub mailowo.",
  addressLabel: "ul. Stefana Jaracza 77B\n50-305 Wrocław",
  googleMapsUrl:
    "https://maps.google.com/?q=ul.+Stefana+Jaracza+77B,+50-305+Wrocław",
  phone: "+48 71 880 87 08",
  phoneClean: "+48718808708",
  email: "kontakt@bistropoleczka.pl",
  openingHours: [
    { days: "Poniedziałek", hours: "Nieczynne" },
    { days: "Wtorek – Piątek", hours: "12:00 – 21:30" },
    { days: "Sobota – Niedziela", hours: "12:00 – 21:30" },
  ],
  footerNote:
    "W święta oraz dni szczególne godziny mogą ulec zmianie. Sprawdź nasze social media lub zadzwoń, by potwierdzić.",
};

export default function ContactClient({
  initialData,
}: {
  initialData: ContactData | null;
}) {
  const data: Required<ContactData> = {
    tagline: initialData?.tagline || defaultContactData.tagline,
    title: initialData?.title || defaultContactData.title,
    subtitle: initialData?.subtitle || defaultContactData.subtitle,
    addressLabel: initialData?.addressLabel || defaultContactData.addressLabel,
    googleMapsUrl:
      initialData?.googleMapsUrl || defaultContactData.googleMapsUrl,
    phone: initialData?.phone || defaultContactData.phone,
    phoneClean: initialData?.phoneClean || defaultContactData.phoneClean,
    email: initialData?.email || defaultContactData.email,
    openingHours:
      initialData?.openingHours && initialData.openingHours.length > 0
        ? initialData.openingHours
        : defaultContactData.openingHours,
    footerNote: initialData?.footerNote || defaultContactData.footerNote,
  };

  const contactDetails = [
    {
      icon: MapPin,
      label: "Adres",
      value: data.addressLabel,
      href: data.googleMapsUrl,
    },
    {
      icon: Phone,
      label: "Telefon",
      value: data.phone,
      href: `tel:${data.phoneClean}`,
    },
    {
      icon: Mail,
      label: "E-mail",
      value: data.email,
      href: `mailto:${data.email}`,
    },
  ];

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#FFFDF6] py-24 md:py-32"
    >
      {/* Decorative elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 opacity-[0.03]">
        <svg width="256" height="256" fill="none">
          {Array.from({ length: 64 }).map((_, i) => (
            <circle
              key={i}
              cx={(i % 8) * 32 + 16}
              cy={Math.floor(i / 8) * 32 + 16}
              r="2"
              fill="#960C3F"
            />
          ))}
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-[#D9A261]">
            {data.tagline}
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#CA5254] md:text-5xl">
            {data.title}
          </h2>
          <p className="mt-4 text-[#A6A6A6] leading-relaxed">{data.subtitle}</p>
          <Separator className="mx-auto mt-6 w-16 bg-[#D9A261]/40" />
        </motion.div>

        {/* Content grid */}
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {/* Contact details */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="mb-8 text-sm font-semibold uppercase tracking-widest text-[#D9A261]">
              Dane kontaktowe
            </h3>
            <ul className="space-y-6">
              {contactDetails.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 transition-colors"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#960C3F]/5 transition-colors group-hover:bg-[#960C3F]/10">
                      <item.icon className="h-4 w-4 text-[#960C3F]" />
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-[#A6A6A6]">
                        {item.label}
                      </span>
                      <p className="mt-0.5 whitespace-pre-line font-medium text-[#960C3F]/80 transition-colors group-hover:text-[#CA5254]">
                        {item.value}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-[#A6A6A6]">
              Lokalizacja: Wrocław – Ołbin / Śródmieście (pogranicze Nadodrza i Zacisza), w sąsiedztwie Mostów Warszawskich, Parku Stanisława Tołpy oraz wałów nad Odrą.
            </p>
          </motion.div>

          {/* Opening hours */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="mb-8 text-sm font-semibold uppercase tracking-widest text-[#D9A261]">
              Godziny otwarcia
            </h3>
            <div className="rounded-2xl border border-[#A6A6A6]/20 bg-white/60 p-6 backdrop-blur-sm">
              <div className="space-y-4">
                {data.openingHours.map((slot) => (
                  <div
                    key={slot.days}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-[#A6A6A6]">
                      {slot.days}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        slot.hours === "Nieczynne"
                          ? "text-[#A6A6A6]"
                          : "text-[#960C3F]"
                      }`}
                    >
                      {slot.hours}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-6 bg-[#A6A6A6]/20" />
              <p className="text-xs leading-relaxed text-[#A6A6A6]">
                {data.footerNote}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Interactive Google Map on the bottom */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 overflow-hidden rounded-3xl border border-[#960C3F]/15 shadow-2xl bg-[#FFFDF6]"
        >
          <iframe
            title="Mapa dojazdu do Bistro Poleczka — ul. Stefana Jaracza 77B, Wrocław (Ołbin / Śródmieście)"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d749.7661774770557!2d17.05717557505761!3d51.12819280088703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470fe993eb819151%3A0xf33797cb88f8c434!2sBistro%20Poleczka!5e1!3m2!1spl!2spl!4v1783777536513!5m2!1spl!2spl"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-[400px] sm:h-[480px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
