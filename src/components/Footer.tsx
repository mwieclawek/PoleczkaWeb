import React from 'react';

function Instagram({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function Facebook({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export function Footer() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container px-6 md:px-12 mx-auto pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <circle cx="16" cy="16" r="15" fill="hsl(359 41% 56%)" />
                {Array.from({ length: 16 }).map((_, i) => {
                  const angle = (i * 360) / 16;
                  const rad = (angle * Math.PI) / 180;
                  const x1 = 16 + 5 * Math.cos(rad);
                  const y1 = 16 + 5 * Math.sin(rad);
                  const x2 = 16 + 13 * Math.cos(rad);
                  const y2 = 16 + 13 * Math.sin(rad);
                  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.5" strokeLinecap="round" />;
                })}
                <circle cx="16" cy="16" r="4" fill="white" />
                <circle cx="16" cy="16" r="2" fill="hsl(359 41% 56%)" />
              </svg>
              <div>
                <div className="text-xl font-serif font-bold text-background leading-none">Poleczka</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-background/40 mt-0.5">Sezonowa kuchnia Polska</div>
              </div>
            </div>
            <p className="text-sm text-background/45 leading-relaxed font-sans max-w-xs">
              Autorska kuchnia polska w centrum Wrocławia. 
              Gotujemy tym, co jest. Karta zmienia się z porami roku.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-8 h-8 border border-background/20 flex items-center justify-center hover:border-primary hover:text-primary transition-all" aria-label="Instagram" data-testid="link-instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-8 h-8 border border-background/20 flex items-center justify-center hover:border-primary hover:text-primary transition-all" aria-label="Facebook" data-testid="link-facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-3 md:col-start-6">
            <p className="text-[10px] tracking-[0.2em] uppercase text-background/30 font-sans mb-5">Znajdź nas</p>
            <div className="space-y-1 text-sm text-background/60 font-sans">
              <p className="text-background font-medium">ul. Świdnicka 28</p>
              <p>50-068 Wrocław</p>
              <a href="tel:+48713456789" className="block mt-4 hover:text-primary transition-colors" data-testid="link-phone">+48 71 345 67 89</a>
            </div>
            <div className="mt-6 text-sm text-background/60 font-sans space-y-0.5">
              <p className="text-background/30 text-[10px] uppercase tracking-widest mb-2">Godziny</p>
              <p>Wt – Pt: 12:00 – 22:00</p>
              <p>Sob – Ndz: 11:00 – 23:00</p>
              <p className="text-background/30 text-xs">Poniedziałek: nieczynne</p>
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-2 md:col-start-11">
            <p className="text-[10px] tracking-[0.2em] uppercase text-background/30 font-sans mb-5">Menu</p>
            <nav className="space-y-3">
              {[
                { name: 'O nas', id: 'about' },
                { name: 'Dania', id: 'menu' },
                { name: 'Sezonowość', id: 'gallery' },
                { name: 'Opinie', id: 'reviews' },
                { name: 'Rezerwacja', id: 'reservation' },
              ].map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="block text-sm text-background/45 hover:text-background transition-colors font-sans"
                  data-testid={`footer-link-${link.id}`}
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>

        </div>

        <div className="border-t border-background/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-background/20 font-sans">
          <p>© 2025 Bistro Poleczka. Wszelkie prawa zastrzeżone.</p>
          <p className="font-serif italic text-background/30">Wrocław, od 2014.</p>
        </div>

      </div>
    </footer>
  );
}
