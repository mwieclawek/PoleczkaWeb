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

## 🍽️ System Rezerwacji Miejsc i Integracja z Telegramem

Aplikacja zawiera dedykowany system rezerwacji z powiadomieniami w czasie rzeczywistym, botem na Telegramie oraz panelem dla obsługi na tablecie.

### 🤖 Instrukcja Skonfigurowania Bota Telegram & Webhooka

1. **Utworzenie Bota w Telegramie (@BotFather):**
   * Otwórz Telegram i wyszukaj użytkownika `@BotFather`.
   * Wyślij komendę `/newbot` i postępuj zgodnie z instrukcjami (podaj nazwę oraz username bota, np. `PoleczkaReservationBot`).
   * `@BotFather` wygeneruje **API Token** (np. `123456789:ABCdefGHI...`). Zapisz go w pliku `.env` jako `TELEGRAM_BOT_TOKEN`.

2. **Pozyskanie `TELEGRAM_CHAT_ID` dla grupy obsługi:**
   * Utwórz grupę na Telegramie dla pracowników restauracji / obsługi.
   * Dodaj utworzonego bota do grupy.
   * Dodaj bota `@raw_data_bot` lub `@userinfobot` do grupy, aby odczytać ID grupy (zazwyczaj zaczyna się od `-100...`). Zapisz go w pliku `.env` jako `TELEGRAM_CHAT_ID`.

3. **Ustawienie Webhooka Telegrama (Dla Cloud Functions):**
   * Po wdrożeniu funkcji `telegramWebhook` w Firebase Cloud Functions (lub lokalnie przez ngrok/emulator), ustaw webhook wywołując w przeglądarce URL:
     ```http
     https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<REGION>-<PROJECT_ID>.cloudfunctions.net/telegramWebhook
     ```
   * Odpowiedź z Telegrama powinna potwierdzić: `{"ok":true,"result":true,"description":"Webhook was set"}`.

4. **Panel Tabletu / Obsługi:**
   * Dostęp pod adresem: `/admin/reservations` lub `/panel/rezerwacje`.
   * Panel wykorzystuje `onSnapshot` z Firebase Firestore do nasłuchiwania na żywo.
   * Przy pojawieniu się rezerwacji o statusie `pending`, panel automatycznie odtwarza powiadomienie dźwiękowe (Web Audio API Chime) oraz wyświetla interaktywne okno z danymi klienta i przyciskami **Akceptuj** / **Odrzuć**.

---

## 🏗️ Architektura i Hybrydowy System CMS

Aplikacja wykorzystuje architekturę hybrydową Next.js App Router (`Server + Client Components`):

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
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│              System Rezerwacji & Firestore             │
│        Formularz, Telegram Bot & Panel Tabletu         │
└────────────────────────────────────────────────────────┘
```

---

## 🛡️ Mechanizm "Coming Soon" (`src/middleware.ts`)

Aplikacja jest chroniona przed niepowołanym dostępem w okresie przed otwarciem restauracji, przy jednoczesnym zachowaniu wygody dla programistów i redaktorów:

* **Dla zwykłych odwiedzających:** Każde wejście pod dowolny adres (np. `https://bistropoleczka.pl/`) zostaje po stronie serwera dyskretnie przepisywane (`NextResponse.rewrite`) na widok `/coming-soon`. Pasek adresu URL pozostaje czysty.
* **Dla programistów i zespołu (Odblokowanie):** Aby wejść na pełną stronę lub do panelu CMS / Admina, wystarczy dopisać do adresu parametr `?admin=poleczka`:
  👉 **`https://bistropoleczka.pl/?admin=poleczka`** (lub lokalnie: `http://localhost:3000/?admin=poleczka` / `http://localhost:3000/admin/reservations?admin=poleczka`)

---

## 📊 Analityka i Nagrania Sesji (GA4 & Microsoft Clarity)

Aplikacja ma wbudowaną integrację z **Google Analytics 4** (ruch, zdarzenia rezerwacji) oraz **Microsoft Clarity** (heatmaps, nagrania sesji).

### 🛠️ Gdzie wkleić identyfikatory:
W pliku `.env.local` uzupełnij:
* **Google Analytics 4 (`NEXT_PUBLIC_GA_ID`):**
  Pobierz **Identyfikator strumienia danych** (format: `G-XXXXXXXXXX`) z panelu *Google Analytics -> Administracja -> Strumienie danych*.
* **Microsoft Clarity (`NEXT_PUBLIC_CLARITY_ID`):**
  Pobierz **Project ID** (format np.: `xxxxxxxxxx`) z panelu *Microsoft Clarity -> Settings -> Overview*.

Skrypty analityczne ładują się asynchronicznie (oparte o `@next/third-parties` oraz `next/script` ze strategią `afterInteractive`), dzięki czemu nie wpływają na wskaźniki wydajności (Core Web Vitals).

---


## 🚀 Uruchomienie Projektu Lokalnie

### 1. Wymagania wstępne
* **Node.js** w wersji `20.x` lub nowszej (`24.x` zalecane)
* **npm** / **pnpm** / **yarn**

### 2. Instalacja zależności

```bash
git clone https://github.com/mwieclawek/PoleczkaWeb.git
cd PoleczkaWeb
git checkout feature/reservation-system
npm install
```

### 3. Konfiguracja zmiennych środowiskowych (`.env.local`)
Skopiuj wzorzec z `.env.example` do `.env.local` i uzupełnij klucze.

### 4. Uruchomienie serwera deweloperskiego

```bash
npm run dev
```

* 🌐 **Aplikacja (Strona Główna / Rezerwacja):** [http://localhost:3000](http://localhost:3000)
* 📱 **Panel Tabletu (Rezerwacje):** [http://localhost:3000/admin/reservations](http://localhost:3000/admin/reservations)
* ✏️ **Panel CMS (Sanity Studio):** [http://localhost:3000/studio](http://localhost:3000/studio)

---

## 📄 Licencja & Kontakt
Wszelkie prawa zastrzeżone &copy; 2026 **Bistro Poleczka**.  
Lokalizacja: **ul. Stefana Jaracza 77B, 50-305 Wrocław**  
E-mail: `kontakt@bistropoleczka.pl`
