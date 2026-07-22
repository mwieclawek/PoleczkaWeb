"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useReservationModal } from "@/components/ReservationModalContext";

const navLinks = [
  { label: "O nas", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Kontakt", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openModal } = useReservationModal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FFFDF6]/95 backdrop-blur-md shadow-md shadow-[#960C3F]/5 border-b border-[#960C3F]/20 py-2"
          : "bg-transparent py-3"
      }`}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#960C3F] shadow-sm" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 pt-1 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center">
          <img
            src="/logo.png"
            alt="Poleczka — Bistro Kuchnia Polska"
            className="h-16 w-auto md:h-20 transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-base font-semibold tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:transition-all hover:after:w-full text-[#960C3F] hover:text-[#CA5254] after:bg-[#960C3F]"
            >
              {link.label}
            </Link>
          ))}

          {/* Reservation button */}
          <button
            onClick={openModal}
            className="inline-flex h-10 items-center justify-center rounded-full px-7 text-sm font-semibold transition-all bg-[#960C3F] text-[#FFFDF6] shadow-md shadow-[#960C3F]/20 hover:bg-[#CA5254] hover:shadow-lg"
          >
            Zarezerwuj stolik
          </button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#960C3F] hover:bg-[#960C3F]/10 hover:text-[#CA5254]"
                />
              }
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Otwórz menu</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l-[#960C3F]/20 bg-[#FFFDF6]"
            >
              <SheetTitle className="text-[#960C3F] font-heading font-bold text-2xl">
                Nawigacja
              </SheetTitle>
              <div className="mt-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-semibold text-[#960C3F] transition-colors hover:text-[#CA5254]"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile reservation button */}
                <button
                  onClick={() => {
                    setOpen(false);
                    openModal();
                  }}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#960C3F] px-6 py-3 text-base font-semibold text-[#FFFDF6] shadow-md shadow-[#960C3F]/20 transition-all hover:bg-[#CA5254]"
                >
                  Zarezerwuj stolik
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
