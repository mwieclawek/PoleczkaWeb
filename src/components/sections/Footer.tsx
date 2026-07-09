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
    <footer className="bg-[#960C3F] text-[#FFFDF6]">
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
              <img
                src="/logo.png"
                alt="Poleczka — Bistro Kuchnia Polska"
                className="h-8 w-auto brightness-0 invert transition-opacity hover:opacity-80"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#FFFDF6]/70">
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
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-[#D9A261]">
              Nawigacja
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#FFFDF6]/70 transition-colors hover:text-[#CA5254]"
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
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-[#D9A261]">
              Znajdź nas
            </h3>
            <p className="text-sm text-[#FFFDF6]/70 leading-relaxed">
              ul. Stefana Jaracza 77B
              <br />
              50-305 Wrocław
            </p>

            <Separator className="my-6 bg-[#FFFDF6]/10" />

            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FFFDF6]/20 text-[#FFFDF6]/70 transition-all hover:border-[#CA5254] hover:text-[#CA5254] hover:bg-[#CA5254]/10"
                  aria-label={link.label}
                >
                  <link.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <Separator className="my-10 bg-[#FFFDF6]/10" />
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-[#FFFDF6]/40 md:flex-row">
          <span>
            © {new Date().getFullYear()} Poleczka. Wszelkie prawa zastrzeżone.
          </span>
          <span>
            Zbudowane z{" "}
            pasją we Wrocławiu
          </span>
        </div>
      </div>
    </footer>
  );
}
