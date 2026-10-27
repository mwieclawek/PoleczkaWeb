# Przewodnik dla Programistów (Contributing Guide) — Bistro Poleczka

Dokument opisuje zasady pracy z kodem źródłowym aplikacji internetowej **Bistro Poleczka** oraz proces wdrażania zmian na produkcję w Google Firebase App Hosting.

---

## 1. Przepływ pracy z gałęziami (Git)

- **Gałąź produkcyjna (`main`):** Jest podłączona do automatycznych wdrożeń w Firebase App Hosting. Każdy push na `main` uruchamia budowanie nowej wersji produkcyjnej.
- **Gałęzie robocze (`feat/*`, `fix/*`, `chore/*`):** Nowe funkcje i poprawki należy rozwijać na osobnych gałęziach tworzonych z `main`.

---

## 2. Synchronizacja `package.json` i `package-lock.json`

Firebase App Hosting buduje projekt przy użyciu komendy `npm ci`. Oznacza to, że:

1. Nie należy edytować `package.json` ręcznie bez uruchomienia `npm install`.
2. Do commita należy zawsze dołączać zarówno `package.json`, jak i `package-lock.json`.

---

## 3. Standardy UI i SEO

- **Kolorystyka (Tailwind CSS v4):**
  - `#FFFDF6` — ciepły krem (tło)
  - `#960C3F` — głęboki burgund (nagłówki, główny akcent)
  - `#CA5254` — róż (przyciski CTA, cennik)
  - `#D9A261` — złoto (separatory, detale)
- **Renderowanie treści dla SEO:**
  - Zawartość zakładek (np. kategorie w karcie dań lub warianty pakietów) powinna być obecna w drzewie HTML od razu przy renderowaniu serwerowym (SSR) i przełączana klasami CSS (`block` / `hidden`), aby roboty wyszukiwarek widziały pełną treść strony.
  - Każda publiczna podstrona dodawana do `src/app/sitemap.ts` musi eksportować własny obiekt `metadata` z poprawnym adresem kanonicznym (`alternates.canonical`).
  - Znaczniki `<img>` muszą posiadać jawnie zdefiniowane atrybuty `width` i `height` w celu uniknięcia przesunięć układu strony (CLS).

---

## 4. Zarządzanie schematami Sanity CMS

W przypadku dodawania nowej sekcji edytowalnej w CMS:

1. Utwórz plik schematu w `src/sanity/schemaTypes/`.
2. Zarejestruj schemat w `src/sanity/schemaTypes/index.ts`.
3. Pobieraj dane po stronie serwera w komponencie serwerowym (`client.fetch` z opcją `{ next: { revalidate: 60 } }`) i przekazuj je jako `initialData` do komponentu klienckiego. Nie wykonuj duplikujących zapytań do Sanity wewnątrz `useEffect` w przeglądarce.

---

## 5. Weryfikacja przed wdrożeniem

Przed wysłaniem zmian do repozytorium sprawdź poprawność projektu:

```bash
npm run lint
npx next build
```
