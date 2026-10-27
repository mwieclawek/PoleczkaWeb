# Instrukcja Obsługi Panelu Zarządzania Treścią (Sanity CMS) — Bistro Poleczka

Podręcznik dla zespołu **Bistro Poleczka** opisujący sposób edycji karty dań, cen, godzin otwarcia oraz tekstów na stronie internetowej.

---

## 1. Logowanie do panelu CMS

Panel zarządzania treścią znajduje się pod adresem:
- Produkcyjnie: `https://bistropoleczka.pl/studio`
- Lokalnie: `http://localhost:3000/studio`

Zaloguj się za pomocą konta Google lub adresu e-mail uprawnionego w projekcie Sanity.

---

## 2. Edycja karty dań (Menu)

1. W lewej kolumnie panelu wybierz **Sekcja "Menu" (Karta dań na stronie)**.
2. Otwórz dokument menu (np. *Menu Jesienne*).
3. Dostępne pola główne:
   - **Tag sezonowy:** np. `Sezon: Jesień 2026`
   - **Tytuł sekcji:** np. `Menu Jesienne`
   - **Opis sekcji:** opcjonalny krótki wstęp pod tytułem
   - **Notatka pod kartą menu:** tekst wyświetlany na dole sekcji menu
4. **Kategorie i pozycje w menu:**
   - W sekcji **Kategorie w menu** wybierz odpowiednią zakładkę (*Dania mniejsze*, *Zupy*, *Dania główne*, *Desery*, *Dla dzieci*).
   - Aby dodać nowe danie, kliknij `Add item` na dole listy pozycji.
   - Uzupełnij **Nazwę dania**, **Opis składników** oraz **Cenę w zł** (jako liczbę, np. `39`).
   - Zaznaczenie opcji **Wyróżnij jako "Klasyk Poleczki"** dodaje przy daniu pionowy akcent i oznaczenie na karcie.
5. Po wprowadzeniu zmian kliknij przycisk **Publish** w prawym dolnym rogu. Strona odświeża dane z CMS automatycznie w ciągu 60 sekund.

---

## 3. Zmiana godzin otwarcia i danych kontaktowych

1. W lewej kolumnie wybierz **Sekcja "Kontakt" i Godziny Otwarcia**.
2. W sekcji **Godziny otwarcia** możesz zmodyfikować przedziały godzinowe dla poszczególnych dni tygodnia.
3. W polu **Uwaga pod godzinami otwarcia** możesz zamieścić informację o zmianach godzin w święta lub dni ustawowo wolne.
4. Kliknij **Publish**, aby zapisać zmiany.

---

## 4. Edycja sekcji "Hero", "O nas" oraz stopki

- **Sekcja "Hero":** pozwala zmienić nagłówek główny, podtytuł powitalny oraz teksty przycisków na górze strony.
- **Sekcja "O nas":** pozwala edytować nagłówek, akapity opisujące historię bistro oraz kafelki z głównymi wartościami lokalu.
- **Ustawienia Strony (Stopka i Linki):** pozwalają zaktualizować krótki opis w stopce, adres e-mail oraz linki do profili na Instagramie i Facebooku.

---

## 5. Przywracanie wcześniejszych wersji

W prawym górnym rogu edytowanego dokumentu w Sanity Studio znajduje się historia zmian (**History**), która umożliwia podgląd poprzednich wersji oraz przywrócenie wcześniejszej publikacji (`Restore`).
