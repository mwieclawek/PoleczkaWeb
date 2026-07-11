# 🍷 Bistro Poleczka — Nowoczesna Kuchnia Polska we Wrocławiu

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Sanity CMS](https://img.shields.io/badge/Sanity_CMS-v3-F03E2F?style=for-the-badge&logo=sanity)](https://www.sanity.io/)
[![Firebase App Hosting](https://img.shields.io/badge/Firebase_App_Hosting-Cloud-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-black?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

> **Poleczka** to nowoczesna restauracja kuchni polskiej we Wrocławiu przy ul. Stefana Jaracza 77B. Łączymy szacunek do tradycyjnych, lokalnych składników z nowoczesnymi technikami kulinarnymi (sous-vide, pieczenie w masie solnej, fermentacja).

Niniejsze repozytorium zawiera kod źródłowy oficjalnej aplikacji internetowej bistro, zintegrowany z systemem zarządzania treścią **Sanity CMS**, wyposażony w interaktywne animacje oraz mechanizm ochrony dostępu *"Coming Soon"*.

---

## 🎨 System Wizualny i Branding (Design System)

Aplikacja została zaprojektowana zgodnie z księgą znaku i kolorystyką **Bistro Poleczka**, zastępując standardowe szablony unikalną, ekskluzywną paletą barw:

| Rola w systemie | Kolor | Kod HEX | Zastosowanie |
| :--- | :--- | :--- | :--- |
| **Główne Tło** | Ciepły Krem | `#FFFDF6` | Tło całej strony, karty, modale, czystość i przytulność |
| **Akcent Główny / Tekst** | Głęboki Burgund / Wine | `#960C3F` | Nagłówki, logotyp, kontrastowy tekst, sekcja stopki |
| **Akcent Wyróżniający** | Róż / Rose Pink | `#CA5254` | Przyciski CTA, ceny w menu, znaczniki aktywne |
| **Akcent Dopełniający** | Złoto / Drewno | `#D9A261` | Separatory, etykiety sezonowe, obramowania, dekoracje |

### ✒️ Typografia
* **Nagłówki (`--font-heading`):** [`Poiret One`](https://fonts.google.com/specimen/Poiret+One) — elegancki, geometryczny font nadający prestiżowy charakter bistro.
* **Tekst główny (`--font-sans`):** [`Open Sans`](https://fonts.google.com/specimen/Open+Sans) — czytelny font bezszeryfowy do opisów dań, historii i nawigacji.

---

## 🏗️ Architektura i Hybrydowy System CMS

Aby zapewnić **maksymalną wydajność (SEO i szybkość ładowania)** oraz jednoczesną **pełną edytowalność dla zespołu restoracji**, aplikacja wykorzystuje architekturę hybrydową Next.js App Router (`Server + Client Components`):

```
┌────────────────────────────────────────────────────────┐
│                   Sanity Studio (CMS)                  │
│       Edycja dań, cen, historii, godzin otwarcia      │
└───────────────────────────┬────────────────────────────┘
                            ▼ (Fetch przez @/sanity/client)
┌────────────────────────────────────────────────────────┐
│             Server Component (np. MenuSection)         │
│     Pobiera aktualny dokument z bazy (lub zwraca null) │
└───────────────────────────┬────────────────────────────┘
                            ▼ (Przekazuje jako initialData)
┌────────────────────────────────────────────────────────┐
│             Client Component (np. MenuSectionClient)   │
│  Zarządza animacjami Framer Motion i stanem zakładek. │
│  Posiada wbudowane dane domyślne (fallback defaults)   │
└────────────────────────────────────────────────────────┘
```

### 📂 Zarejestrowane Schematy w Sanity (`src/sanity/schemaTypes/`)
1. **`heroType` (`hero.ts`)** — Główny baner, tagline, nagłówki, przyciski CTA.
2. **`aboutType` (`about.ts`)** — Historia restauracji, data wielkiego otwarcia, 4 filary filozofii kuchni.
3. **`menuType` (`menu.ts`)** — Karta dań podzielona na dynamiczne kategorie (*Przystawki, Zupy, Dania główne, Desery, Napoje & Spritz, Dla dzieci*), ceny i oznaczenia *"Klasyk Poleczki"*.
4. **`contactType` (`contact.ts`)** — Adres, telefony, link do Google Maps oraz harmonogram godzin otwarcia w poszczególne dni.
5. **`comingSoonType` (`comingSoon.ts`)** — Teksty widoczne na ekranie zaślepki *"Wkrótce otwarcie"*.
6. **`siteSettingsType` (`siteSettings.ts`)** — Opis w stopce, linki społecznościowe (Instagram, Facebook) i prawa autorskie.

---

## 🛡️ Mechanizm "Coming Soon" (`src/middleware.ts`)

Aplikacja jest chroniona przed niepowołanym dostępem w okresie przed otwarciem restauracji, przy jednoczesnym zachowaniu wygody dla programistów i redaktorów:

* **Dla zwykłych odwiedzających:** Każde wejście pod dowolny adres (np. `https://bistropoleczka.pl/`) zostaje po stronie serwera dyskretnie przepisywane (`NextResponse.rewrite`) na widok `/coming-soon`. Pasek adresu URL pozostaje czysty.
* **Dla programistów i zespołu (Odblokowanie):** Aby wejść na pełną stronę lub do panelu CMS, wystarczy dopisać do adresu parametr `?admin=poleczka`:
  👉 **`https://bistropoleczka.pl/?admin=poleczka`** (lub lokalnie: `http://localhost:3000/?admin=poleczka`)
  
  Middleware automatycznie:
  1. Nadaje bezpieczne ciasteczko `dev_access=true` (ważne przez **30 dni**).
  2. Przekierowuje na czysty adres `/`, odblokowując całe menu, sekcje oraz panel `/studio`.

---

## 🚀 Uruchomienie Projektu Lokalnie

### 1. Wymagania wstępne
* **Node.js** w wersji `20.x` lub nowszej (`24.x` zalecane)
* **npm** / **pnpm** / **yarn**

### 2. Instalacja zależności
Z racji rygorystycznych wymogów środowisk chmurowych (Firebase App Hosting), rekomendowane jest używanie zsynchronizowanego pliku `package-lock.json`:

```bash
git clone https://github.com/mwieclawek/PoleczkaWeb.git
cd PoleczkaWeb
npm ci
# lub standardowo: npm install
```

### 3. Konfiguracja zmiennych środowiskowych (`.env.local`)
Utwórz plik `.env.local` w głównym katalogu projektu:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="2hk4fqe9"
NEXT_PUBLIC_SANITY_DATASET="production"
```

### 4. Uruchomienie serwera deweloperskiego

```bash
npm run dev
```

* 🌐 **Aplikacja (Strona Główna / Coming Soon):** [http://localhost:3000](http://localhost:3000)
* ✏️ **Panel Zarządzania Treścią (Sanity Studio):** [http://localhost:3000/studio](http://localhost:3000/studio)

---

## ☁️ Wdrożenie na Firebase App Hosting

Projekt jest skonfigurowany pod automatyczne wdrożenia w chmurze **Google Firebase App Hosting** (region `europe-west4`).

1. Każdą zmianę w kodzie wypychamy na gałąź `main`:
   ```bash
   git add -A
   git commit -m "feat: opis Twoich zmian"
   git push origin main
   ```
2. Firebase automatycznie pobiera repozytorium, instaluje pakiety komendą `npm ci --quiet` i buduje kontener produkcyjny Next.js Turbopack.

> [!WARNING]
> **Ważne dla kompatybilności `npm ci` w Firebase:**  
> Jeśli dodajesz nową bibliotekę komendą `npm install <pakiet>`, upewnij się, że plik `package-lock.json` został wygenerowany poprawnie i zacommitowany razem z `package.json`. Nigdy nie usuwaj pliku lockfile przed wysłaniem na GitHub.

---

## 📚 Struktura Katalogów

```
PoleczkaWeb/
├── public/                  # Pliki statyczne, favicon, logotyp (/logo.png)
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── coming-soon/     # Widok zaślepki przed otwarciem
│   │   ├── studio/          # Zintegrowane Sanity Studio (/studio)
│   │   ├── globals.css      # Design system, zmienne kolorów i utility Tailwind
│   │   ├── layout.tsx       # Główny układ, konfiguracja czcionek Google Fonts
│   │   └── page.tsx         # Strona główna łącząca wszystkie sekcje
│   ├── components/
│   │   ├── sections/        # Moduły strony (Hero, About, MenuSection, Contact, Navbar, Footer)
│   │   └── ui/              # Komponenty interfejsu (Shadcn/ui: Tabs, Separator, Button)
│   ├── lib/                 # Funkcje pomocnicze (utils.ts)
│   ├── middleware.ts        # Ochrona dostępu (Coming Soon & ciasteczko dev_access)
│   └── sanity/
│       ├── client.ts        # Klient Sanity (z fallbackiem zmiennych .env)
│       ├── env.ts           # Konfiguracja środowiska Sanity
│       └── schemaTypes/     # Definicje schematów (hero, about, menu, contact, comingSoon...)
├── package.json
├── tailwind.config.ts / postcss
└── README.md
```

---

## 📄 Licencja & Kontakt
Wszelkie prawa zastrzeżone &copy; 2026 **Bistro Poleczka**.  
Lokalizacja: **ul. Stefana Jaracza 77B, 50-305 Wrocław**  
E-mail: `kontakt@bistropoleczka.pl`
