# 🤝 Przewodnik dla Współtwórców i Programistów (Contributing Guide) — Bistro Poleczka

Dziękujemy za chęć rozwijania aplikacji internetowej **Bistro Poleczka**! Aby utrzymać najwyższą jakość kodu, czystość architektury i bezawaryjność na produkcji w Firebase App Hosting, prosimy o przestrzeganie poniższych zasad.

---

## 🌿 1. Przepływ Pracy z Gałęziami (Branching Workflow)

* **Gałąź produkcyjna (`main`):** Jest bezpośrednio podłączona pod automatyczne wdrożenia w Google Firebase App Hosting. Każdy push do `main` wyzwala budowanie nowej wersji live.
* **Gałęzie funkcjonalne (`feat/*`, `fix/*`, `chore/*`):** Nowe sekcje lub poprawki twórz na osobnych gałęziach wywodzących się z `main`:
  ```bash
  git checkout -b feat/nowa-sekcja-galerii
  ```

---

## 🛑 2. Złota Zasada `package-lock.json` i Firebase

Google Firebase App Hosting buduje projekt przy użyciu rygorystycznej komendy `npm ci`. Oznacza to, że:

1. **Nigdy nie modyfikuj `package.json` ręcznie bez uruchomienia `npm install`.**
2. **Zawsze dodawaj do commita zarówno `package.json`, jak i `package-lock.json`.**  
   Pliki te muszą być ze sobą idealnie zsynchronizowane w 100%.
3. Jeśli instalujesz nową bibliotekę (np. `@radix-ui/react-dialog`), używaj flagi zapisu:
   ```bash
   npm install @radix-ui/react-dialog
   ```

---

## 🎨 3. Standardy Wyglądu i Animacji (UI & Styling)

* **Design System (Tailwind CSS v4):** Korzystamy wyłącznie z predefiniowanych zmiennych i kolorów markowych bistro zdefiniowanych w `globals.css` oraz palecie:
  * `#FFFDF6` — Ciepły krem (Tło)
  * `#960C3F` — Burgund / Wine (Nagłówki, główny akcent)
  * `#CA5254` — Róż (CTA, cennik)
  * `#D9A261` — Złoto (Separatory, detale)
* **Animacje (`framer-motion`):** Każda nowa sekcja powinna wejść płynnie na ekran przy scrollowaniu (`whileInView`, `viewport: { once: true }`). Unikaj zbyt agresywnych lub odwracających uwagę animacji — design ma być elegancki i prestiżowy.

---

## 🧱 4. Dodawanie Nowych Schematów w Sanity CMS

Jeśli tworzysz nową sekcję na stronie (np. *Galeria Wnętrz* lub *Opinie Gości*) i chcesz, by była edytowalna w CMS:

1. Utwórz nowy plik schematu w `src/sanity/schemaTypes/galeria.ts`.
2. Zarejestruj schemat w pliku `src/sanity/schemaTypes/index.ts`:
   ```ts
   import { galeriaType } from './galeria'
   export const schema: { types: SchemaTypeDefinition[] } = {
     types: [aboutType, heroType, menuType, contactType, comingSoonType, siteSettingsType, galeriaType],
   }
   ```
3. Zastosuj architekturę hybrydową (`Server Component` z `client.fetch(...)` + fallback do bezpiecznych danych domyślnych w `Client Component`). Dzięki temu strona nigdy nie wysypie się błędem `null/undefined`.

---

## 🧪 5. Weryfikacja Przed Commitem

Przed wysłaniem zmian na GitHuba upewnij się, że projekt przechodzi pełną weryfikację kompilatora:

```bash
# 1. Sprawdzenie linterem
npm run lint

# 2. Pełny build produkcyjny (sprawdza typy TS i schematy Sanity)
npx next build
```

Jeśli `npx next build` zakończy się sukcesem (`Compiled successfully`), Twoje zmiany są gotowe do zacommitowania!
