# Bistro Poleczka — Strona Internetowa i System Rezerwacji

Oficjalna aplikacja internetowa restauracji **Bistro Poleczka** we Wrocławiu (ul. Stefana Jaracza 77B, Śródmieście / Ołbin). Projekt obejmuje stronę główną z kartą dań zarządzaną przez Sanity CMS, podstronę zamówień online (GoOrder), ofertę spotkań wigilijnych oraz system rezerwacji stolików z powiadomieniami na Telegramie i panelem administracyjnym.

---

## Stos technologiczny

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Style i UI:** Tailwind CSS v4, Framer Motion
- **CMS:** Sanity Studio v3 (`/studio`) z odświeżaniem ISR (`revalidate: 60`)
- **Baza danych rezerwacji:** Firebase Firestore
- **Powiadomienia:** Telegram Bot API oraz Nodemailer (SMTP)
- **Hosting:** Google Firebase App Hosting

---

## Struktura projektu i kluczowe ścieżki

- `/` — Strona główna (`Hero`, `O nas`, `Menu`, `Zamów online`, `Kontakt`)
- `/oferta-wigilijna` — Oferta spotkań wigilijnych dla firm i rodzin wraz z plikiem PDF do pobrania (`/oferta-wigilia-2026.pdf`); ścieżka `/wigilia` przekierowuje na nią stałym przekierowaniem HTTP 308
- `/zamow-online` — Formularz zamówień online z dostawą i odbiorem osobistym (widget GoOrder)
- `/admin/reservations` oraz `/panel/reservations` — Panel zarządzania rezerwacjami (chroniony przez HTTP Basic Auth)
- `/studio` — Panel administracyjny Sanity CMS
- `/sitemap.xml` oraz `/robots.txt` — Automatycznie generowana mapa strony i reguły indeksacji

---

## System wizualny

Kolorystyka aplikacji:

| Rola | Kolor | Kod HEX | Zastosowanie |
| :--- | :--- | :--- | :--- |
| Tło główne | Ciepły krem | `#FFFDF6` | Tło strony, kart i okien modalnych |
| Kolor główny | Głęboki burgund | `#960C3F` | Nagłówki, logotyp, przyciski, stopka |
| Akcent wyróżniający | Róż | `#CA5254` | Aktywne zakładki, ceny, elementy wyróżnione |
| Akcent dopełniający | Złoto | `#D9A261` | Separatory, podtytuły, drobne detale |

Typografia:
- Nagłówki (`--font-heading`): `Poiret One`
- Tekst główny (`--font-sans`): `Open Sans`

---

## System rezerwacji i integracja z Telegramem

1. **Konfiguracja bota Telegram:**
   - Utwórz bota przez `@BotFather` i zapisz token w zmiennej `TELEGRAM_BOT_TOKEN`.
   - Dodaj bota do grupy obsługi i zapisz identyfikator czatu w `TELEGRAM_CHAT_ID`.
   - Skonfiguruj webhook wskazujący na endpoint aplikacji:
     ```http
     https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://bistropoleczka.pl/api/telegram-webhook
     ```
   - Przyciski pod powiadomieniem w Telegramie pozwalają od razu zaakceptować lub odrzucić rezerwację, co aktualizuje status w Firestore i wysyła wiadomość e-mail do gościa.

2. **Dostęp do panelu rezerwacji (`/admin/reservations`):**
   - Ścieżki `/admin/*` oraz `/panel/*` są zabezpieczone przez HTTP Basic Auth (`src/middleware.ts`).
   - Login: `admin`, hasło: wartość zmiennej `ADMIN_PASSWORD` z pliku `.env.local`.

3. **Powiadomienia e-mail (SMTP):**
   - Po zmianie statusu rezerwacji system wysyła potwierdzenie lub informację o braku wolnych miejsc.
   - Wymagane zmienne: `GMAIL_USER` oraz `GMAIL_APP_PASSWORD`.

---

## Architektura pobierania danych z Sanity CMS

Sekcje treści (`Hero`, `About`, `MenuSection`, `Contact`, `Footer`) są podzielone na:
- **Komponenty serwerowe (`src/components/sections/*.tsx`)** — pobierają dane z Sanity CMS po stronie serwera z wykorzystaniem ISR (`revalidate: 60`) i przekazują je jako `initialData`.
- **Komponenty klienckie (`src/components/sections/*Client.tsx`)** — odpowiadają za interakcje oraz animacje i posiadają pełne dane zapasowe (`default...Data`) zsynchronizowane z aktualną zawartością bazy Sanity. Wszystkie kategorie menu oraz pakiety wigilijne są renderowane w drzewie DOM od razu podczas SSR, a przełączanie zakładek odbywa się za pomocą klas CSS (`block` / `hidden`), co zapewnia pełną indeksację karty dań przez wyszukiwarki.

---

## Uruchomienie lokalne

1. **Wymagania:** Node.js `20.x` lub nowszy, `npm`.
2. **Instalacja zależności:**
   ```bash
   npm install
   ```
3. **Zmienne środowiskowe:**
   Skopiuj `.env.example` do `.env.local` i uzupełnij wymagane klucze (Sanity, Firebase, Telegram, SMTP, GA4/Clarity).
4. **Serwer deweloperski:**
   ```bash
   npm run dev
   ```
   - Strona główna: `http://localhost:3000`
   - Panel rezerwacji: `http://localhost:3000/admin/reservations`
   - Sanity Studio: `http://localhost:3000/studio`

---

## Kontakt

**Bistro Poleczka**  
ul. Stefana Jaracza 77B, 50-305 Wrocław  
Tel.: +48 71 880 87 08  
E-mail: `kontakt@bistropoleczka.pl`
