"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const contactDetails = [
  {
    icon: MapPin,
    label: "Adres",
    value: "ul. Stefana Jaracza 77B\n50-305 Wrocław",
    href: "https://maps.google.com/?q=ul.+Stefana+Jaracza+77B,+50-305+Wrocław",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: "+48 71 123 45 67",
    href: "tel:+48711234567",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "kontakt@poleczka.pl",
    href: "mailto:kontakt@poleczka.pl",
  },
];

const openingHours = [
  { days: "Poniedziałek", hours: "Nieczynne" },
  { days: "Wtorek – Piątek", hours: "12:00 – 22:00" },
  { days: "Sobota – Niedziela", hours: "12:00 – 23:00" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#F9F3DB] py-24 md:py-32"
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
              fill="#1028AB"
            />
          ))}
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-medium uppercase tracking-widest text-[#D9A261]">
            Kontakt
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#CA5254] md:text-5xl">
            Odwiedź nas
          </h2>
          <p className="mt-4 text-[#A6A6A6]">
            Znajdziesz nas w samym sercu Wrocławia. Zarezerwuj stolik
            telefonicznie lub mailowo.
          </p>
          <Separator className="mx-auto mt-6 w-16 bg-[#D9A261]/40" />
        </motion.div>

        {/* Content grid */}
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          {/* Contact details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1028AB]/5 transition-colors group-hover:bg-[#1028AB]/10">
                      <item.icon className="h-4 w-4 text-[#1028AB]" />
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wider text-[#A6A6A6]">
                        {item.label}
                      </span>
                      <p className="mt-0.5 whitespace-pre-line font-medium text-[#1028AB]/80 transition-colors group-hover:text-[#CA5254]">
                        {item.value}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Opening hours */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="mb-8 text-sm font-semibold uppercase tracking-widest text-[#D9A261]">
              Godziny otwarcia
            </h3>
            <div className="rounded-2xl border border-[#A6A6A6]/20 bg-white/60 p-6 backdrop-blur-sm">
              <div className="space-y-4">
                {openingHours.map((slot) => (
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
                          : "text-[#1028AB]"
                      }`}
                    >
                      {slot.hours}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-6 bg-[#A6A6A6]/20" />
              <p className="text-xs leading-relaxed text-[#A6A6A6]">
                W święta oraz dni szczególne godziny mogą ulec zmianie.
                Sprawdź nasze social media lub zadzwoń, by potwierdzić.
              </p>
            </div>

            {/* Map placeholder */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#1028AB]/5 bg-[#1028AB] p-8 text-center shadow-lg shadow-[#1028AB]/10">
              <MapPin className="mx-auto mb-3 h-8 w-8 text-[#CA5254]" />
              <p className="font-heading text-lg font-semibold text-[#F9F3DB]">
                ul. Stefana Jaracza 77B
              </p>
              <p className="mt-1 text-sm text-[#F9F3DB]/70">
                50-305 Wrocław
              </p>
              <a
                href="https://maps.google.com/?q=ul.+Stefana+Jaracza+77B,+50-305+Wrocław"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#F9F3DB]/20 bg-[#F9F3DB]/10 px-4 py-2 text-xs font-medium text-[#F9F3DB] transition-colors hover:bg-[#F9F3DB]/20"
              >
                <MapPin className="h-3 w-3" />
                Otwórz w Google Maps
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
