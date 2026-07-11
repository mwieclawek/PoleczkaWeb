# 🔒 Bezpieczeństwo i Polityka Prywatności (Security Policy) — Bistro Poleczka

Bezpieczeństwo danych naszych gości, stabilność aplikacji oraz ochrona panelu zarządzania treścią są dla nas najwyższym priorytetem. Poniższy dokument opisuje zasady bezpieczeństwa obowiązujące w projekcie **Bistro Poleczka**.

---

## 🛡️ 1. Ochrona Panelu Sanity Studio (`/studio`)

* **Uwierzytelnianie:** Dostęp do panelu `/studio` jest chroniony autoryzacją po stronie Sanity (Google OAuth / Single Sign-On / konta e-mail z autoryzacją dwuskładnikową 2FA).
* **CORS Origins:** W panelu zarządzania na stronie [manage.sanity.io](https://manage.sanity.io) dla projektu `2hk4fqe9` dozwolone są wyłącznie zaufane domeny:
  * `http://localhost:3000` (dla programistów)
  * `https://bistropoleczka.pl` oraz domeny robocze Firebase (`*.web.app`, `*.firebaseapp.com`).
* **Zmienne publiczne a prywatne:**
  * W plikach `.env.local` oraz na frontendzie (`NEXT_PUBLIC_SANITY_PROJECT_ID`) używane są wyłącznie **publiczne identyfikatory projektu**, które posiadają uprawnienia do odczytu publicznych treści (karta dań, opis o nas, godziny otwarcia).
  * **Nigdy nie umieszczaj w kodzie po stronie klienta (`NEXT_PUBLIC_*`) tokenów zapisu (`SANITY_API_WRITE_TOKEN`).** Wszelkie operacje zapisu odbywają się wyłącznie przez autoryzowany panel Sanity Studio lub zabezpieczone funkcje serwerowe (`Server Actions`).

---

## 🍪 2. Mechanizm Cookie `dev_access` (Coming Soon)

Aplikacja wykorzystuje ciasteczko `dev_access=true` do odblokowania widoku strony przed oficjalnym otwarciem w sierpniu 2026:

* Ciasteczko nie zawiera żadnych wrażliwych danych osobowych ani haseł.
* Służy wyłącznie do poinformowania `middleware.ts`, że dany użytkownik jest członkiem zespołu lub deweloperem i powinien mieć dostęp do podglądu strony głównej zamiast zaślepki `/coming-soon`.
* Ciasteczko wygasa automatycznie po 30 dniach (`max-age: 2592000`).

---

## 🚨 3. Zgłaszanie Podatności i Błędów Bezpieczeństwa

Jeśli wykryjesz potencjalną lukę bezpieczeństwa w aplikacji internetowej Bistro Poleczka (np. błąd w konfiguracji Firebase, nieprawidłowo wystawiony endpoint API lub problem z autoryzacją), prosimy o kontakt:

* **E-mail:** `kontakt@bistropoleczka.pl`
* **Temat wiadomości:** `[SECURITY] Zgłoszenie podatności w aplikacji PoleczkaWeb`

Zobowiązujemy się do weryfikacji każdego zgłoszenia w ciągu 48 godzin i wdrożenia łatki bezpieczeństwa w trybie priorytetowym. Prosimy o nieupublicznianie informacji o luce przed jej oficjalnym załataniem.
