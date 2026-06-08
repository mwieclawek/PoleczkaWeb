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
          ? "bg-[#FAF7F0]/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-baseline gap-1">
          <span
            className={`font-heading text-2xl font-bold tracking-tight transition-colors ${
              scrolled
                ? "text-[#2C3E2D] group-hover:text-[#4A6741]"
                : "text-[#FAF7F0] group-hover:text-[#D4A853]"
            }`}
          >
            Poleczka
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:transition-all hover:after:w-full ${
                scrolled
                  ? "text-[#2C3E2D]/70 hover:text-[#2C3E2D] after:bg-[#4A6741]"
                  : "text-[#FAF7F0]/70 hover:text-[#FAF7F0] after:bg-[#D4A853]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#menu"
            className={`inline-flex h-8 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors ${
              scrolled
                ? "bg-[#2C3E2D] text-[#FAF7F0] hover:bg-[#4A6741]"
                : "bg-[#FAF7F0] text-[#2C3E2D] hover:bg-[#D4A853] hover:text-[#2C3E2D]"
            }`}
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
                  className={
                    scrolled ? "text-[#2C3E2D]" : "text-[#FAF7F0]"
                  }
                />
              }
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Otwórz menu</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] border-l-[#4A6741]/20 bg-[#FAF7F0]"
            >
              <SheetTitle className="text-[#2C3E2D]">Nawigacja</SheetTitle>
              <div className="mt-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-[#2C3E2D]/80 transition-colors hover:text-[#2C3E2D]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="#menu"
                  onClick={() => setOpen(false)}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#2C3E2D] px-6 py-2.5 text-sm font-medium text-[#FAF7F0] transition-colors hover:bg-[#4A6741]"
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
