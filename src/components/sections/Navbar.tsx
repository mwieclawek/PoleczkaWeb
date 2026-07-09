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

const navLinks = [
  { label: "O nas", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Kontakt", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#FFFDF6]/95 backdrop-blur-md shadow-sm border-b border-[#A6A6A6]/20"
          : "bg-transparent py-2"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center">
          <img
            src="/logo.png"
            alt="Poleczka — Bistro Kuchnia Polska"
            className="h-16 w-auto md:h-20 transition-opacity group-hover:opacity-80"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:transition-all hover:after:w-full text-[#960C3F] hover:text-[#CA5254] after:bg-[#CA5254]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#menu"
            className="inline-flex h-8 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors bg-[#CA5254] text-[#FFFDF6] hover:bg-[#960C3F]"
          >
            Zobacz menu
          </Link>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#960C3F] hover:bg-[#960C3F]/5 hover:text-[#CA5254]"
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
              <SheetTitle className="text-[#CA5254] font-heading text-xl">Nawigacja</SheetTitle>
              <div className="mt-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-[#960C3F]/80 transition-colors hover:text-[#CA5254]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="#menu"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#CA5254] px-6 py-2.5 text-sm font-medium text-[#FFFDF6] transition-colors hover:bg-[#960C3F]"
                >
                  Zobacz menu
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}
