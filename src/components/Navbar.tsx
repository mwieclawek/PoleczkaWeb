import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'O nas', id: 'about' },
  { name: 'Dania', id: 'menu' },
  { name: 'Opinie', id: 'reviews' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm border-b border-secondary/10' : 'bg-transparent'
      }`}
      style={{ padding: '20px 0' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="px-8 md:px-12 lg:px-16 flex items-center justify-between">

        {/* Left: logo mark + wordmark */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 select-none group"
          data-testid="logo-home"
        >
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <circle cx="16" cy="16" r="15" fill="hsl(229 83% 37%)" />
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i * 360) / 16;
              const rad = (angle * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={16 + 5 * Math.cos(rad)} y1={16 + 5 * Math.sin(rad)}
                  x2={16 + 13 * Math.cos(rad)} y2={16 + 13 * Math.sin(rad)}
                  stroke="white" strokeWidth="1.4" strokeLinecap="round"
                />
              );
            })}
            <circle cx="16" cy="16" r="3.5" fill="white" />
            <circle cx="16" cy="16" r="1.8" fill="hsl(229 83% 37%)" />
          </svg>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-[0.06em] text-secondary font-sans leading-none group-hover:text-primary transition-colors duration-300">
              Poleczka
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-secondary/35 font-sans mt-0.5 leading-none">
              Wrocław
            </span>
          </div>
        </button>

        {/* Right: nav + CTA */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item, i) => (
            <button
              key={item.name}
              onClick={() => scrollTo(item.id)}
              className="text-[11px] tracking-[0.2em] uppercase font-sans font-medium text-secondary/50 hover:text-secondary transition-colors duration-200"
              data-testid={`nav-link-${item.id}`}
            >
              {item.name}
            </button>
          ))}

          <div className="w-px h-4 bg-secondary/20" />

          <button
            onClick={() => scrollTo('reservation')}
            className="text-[11px] tracking-[0.2em] uppercase font-sans font-semibold bg-primary text-primary-foreground px-5 py-2.5 hover:bg-primary/90 transition-colors duration-200"
            data-testid="nav-cta"
          >
            Rezerwacja
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-secondary p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-secondary/10 overflow-hidden"
          >
            <nav className="flex flex-col px-8 py-8 gap-5">
              {navLinks.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollTo(item.id)}
                  className="text-left text-[11px] tracking-[0.25em] uppercase font-sans font-medium text-secondary/50 hover:text-secondary transition-colors"
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => scrollTo('reservation')}
                className="text-[11px] tracking-[0.2em] uppercase font-sans font-semibold bg-primary text-primary-foreground px-5 py-3 hover:bg-primary/90 transition-colors text-left mt-2"
              >
                Rezerwacja
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
