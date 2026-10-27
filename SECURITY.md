# Polityka Bezpieczeństwa (Security Policy) — Bistro Poleczka

Dokument opisuje zasady bezpieczeństwa obowiązujące w aplikacji internetowej **Bistro Poleczka**.

---

## 1. Ochrona panelu Sanity Studio (`/studio`)

- **Uwierzytelnianie:** Dostęp do panelu `/studio` wymaga autoryzacji kontem uprawnionym w projekcie Sanity (`projectId: 2hk4fqe9`).
- **CORS Origins:** W konfiguracji projektu na `manage.sanity.io` dozwolone są wyłącznie autoryzowane domeny (`https://bistropoleczka.pl`, domeny wdrożeniowe Firebase oraz `http://localhost:3000` na potrzeby deweloperskie).
- **Klucze API:** Zmienne z prefiksem `NEXT_PUBLIC_*` zawierają wyłącznie publiczne identyfikatory projektu i zbioru danych (`dataset`). Tokeny z uprawnieniami zapisu nie mogą być umieszczane w kodzie klienckim.

---

## 2. Ochrona panelu rezerwacji (`/admin` oraz `/panel`)

- Ścieżki `/admin/*` oraz `/panel/*` są chronione na poziomie `src/middleware.ts` przez uwierzytelnianie HTTP Basic Auth.
- Hasło dostępu jest odczytywane ze zmiennej środowiskowej `ADMIN_PASSWORD` po stronie serwera.
- Ścieżki administracyjne, endpointy `/api/*` oraz `/studio/` są wykluczone z indeksacji w pliku `robots.txt`.

---

## 3. Zgłaszanie błędów bezpieczeństwa

W przypadku wykrycia podatności lub błędu bezpieczeństwa w aplikacji prosimy o kontakt:

- **E-mail:** `kontakt@bistropoleczka.pl`
- **Temat wiadomości:** `[SECURITY] Zgłoszenie błędu bezpieczeństwa`
