"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

/* Lucide nie zawiera ikon brandowych — definiujemy SVG inline */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const navLinks = [
  { label: "O nas", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Kontakt", href: "#contact" },
];

const socialLinks = [
  {
    icon: InstagramIcon,
    label: "Instagram",
    href: "https://instagram.com/poleczka.wroclaw",
  },
  {
    icon: FacebookIcon,
    label: "Facebook",
    href: "https://facebook.com/poleczka.wroclaw",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#2C3E2D] text-[#FAF7F0]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl font-bold tracking-tight text-[#FAF7F0]">
                Poleczka
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#FAF7F0]/50">
              Nowoczesna kuchnia polska we Wrocławiu. Tradycyjne składniki,
              nowoczesne techniki — miejsce, gdzie klasyka spotyka się
              z finezją.
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-[#D4A853]">
              Nawigacja
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#FAF7F0]/60 transition-colors hover:text-[#FAF7F0]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-[#D4A853]">
              Znajdź nas
            </h3>
            <p className="text-sm text-[#FAF7F0]/60">
              ul. Stefana Jaracza 77B
              <br />
              50-305 Wrocław
            </p>

            <Separator className="my-6 bg-[#FAF7F0]/10" />

            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FAF7F0]/10 text-[#FAF7F0]/50 transition-all hover:border-[#D4A853]/30 hover:text-[#D4A853]"
                  aria-label={link.label}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <Separator className="my-10 bg-[#FAF7F0]/10" />
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-[#FAF7F0]/30 md:flex-row">
          <span>
            © {new Date().getFullYear()} Poleczka. Wszelkie prawa zastrzeżone.
          </span>
          <span>
            Zbudowane z{" "}
            <span className="text-[#D4A853]/50">♥</span> we Wrocławiu
          </span>
        </div>
      </div>
    </footer>
  );
}
