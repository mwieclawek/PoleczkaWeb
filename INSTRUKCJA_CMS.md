# 📖 Instrukcja Obsługi Panelu Zarządzania Treścią (Sanity CMS) — Bistro Poleczka

Witaj! Ten podręcznik został stworzony dla zespołu **Bistro Poleczka** (menedżerów, kelnerów oraz osób odpowiedzialnych za marketing i social media). Dowiesz się z niego, jak w prosty sposób — bez konieczności znania się na programowaniu — modyfikować menu, zmieniać ceny, aktualizować godziny otwarcia czy publikować komunikaty na stronie internetowej.

---

## 🔑 1. Jak wejść do panelu CMS?

Panel zarządzania jest wbudowany bezpośrednio w naszą stronę internetową.

1. Otwórz przeglądarkę internetową (Chrome, Safari, Firefox lub Edge).
2. Wejdź pod adres panelu:
   👉 **`https://bistropoleczka.pl/studio`**  
   *(lub podczas pracy lokalnej na komputerze: `http://localhost:3000/studio`)*
3. Jeśli strona wyświeta ekran *"Wkrótce otwarcie"*, wejdź najpierw na adres z odblokowaniem:  
   👉 **`https://bistropoleczka.pl/?admin=poleczka`**
4. Zaloguj się swoim kontem Google (lub e-mailem przypisanym do projektu Sanity).

---

## 🥗 2. Jak edytować Kartę Dań (Menu)?

To najczęściej wykonywana operacja przy zmianie pór roku lub wprowadzaniu nowych dań do karty.

1. W lewej kolumnie panelu kliknij zakładkę **`Sekcja "Menu" (Karta dań na stronie)`**.
2. Kliknij w jedyny dostępny dokument (np. *Menu Letnie*).
3. Możesz tu zmienić:
   * **Tag sezonowy:** np. `Sezon: Jesień 2026`
   * **Tytuł sekcji:** np. `Menu Jesienne`
   * **Opis sekcji:** krótki tekst o tym, z jakich składników w tym sezonie korzystamy.
4. **Zarządzanie kategoriami i daniami:**
   * Przewiń do sekcji **`Kategorie w menu`**.
   * Kliknij w wybraną kategorię (np. *Przystawki* lub *Dania główne*).
   * W polu **`Pozycje w tej kategorii`** zobaczysz listę dań.
   * **Aby dodać nowe danie:** Kliknij przycisk `Add item` (Dodaj pozycję) na dole listy.
   * Wpisz **Nazwę dania** (np. *Pierogi z gęsiną*), **Opis składników** oraz **Cenę w zł** (jako samą liczbę, np. `46`).
   * Jeśli danie jest naszym hitem, zaznacz pole **`Wyróżnij jako "Klasyk Poleczki"`** — na stronie otrzyma ono elegancki czerwony pasek z lewej strony i złotą odznakę!
5. **Zapisywanie zmian:**  
   Po zakończeniu edycji kliknij zielony przycisk **`Publish`** (Publikuj) w prawym dolnym lub górnym rogu ekranu. Zmiany natychmiast pojawią się na stronie!

---

## ⏰ 3. Jak zmienić Godziny Otwarcia lub Kontakt?

Jeśli w okresie świątecznym lub długiego weekendu zmieniają się godziny otwarcia restauracji:

1. W lewej kolumnie panelu kliknij **`Sekcja "Kontakt" i Godziny Otwarcia`**.
2. Kliknij w dokument *Odwiedź nas*.
3. Przewiń do sekcji **`Godziny otwarcia`**.
4. Możesz tu edytować istniejące przedziały (np. zmienić *Sobota – Niedziela* z `13:00 – 22:00` na `12:00 – 23:00`).
5. Możesz też zmienić **Uwagę pod godzinami otwarcia** (np. wpisać informację o rezerwacjach na Sylwestra).
6. Kliknij zielony przycisk **`Publish`**.

---

## ℹ️ 4. Jak zaktualizować sekcję "O nas" (Nasza Historia)?

1. Kliknij w lewym menu **`Sekcja "O nas" (Filozofia, historia i filary kuchni)`**.
2. Możesz edytować:
   * **Datę otwarcia** (np. *Sierpień 2026*)
   * **Akapity historii bistro:** Kliknij w wybrany akapit, aby zmienić treść, lub dodaj nowy akapit przyciskiem `Add item`.
   * **Filary filozofii (4 kafle):** Możesz edytować tytuły i opisy takich haseł jak *Lokalne składniki* czy *Rzemieślnicze techniki*.
3. Kliknij zielony przycisk **`Publish`**.

---

## 🚀 5. Jak edytować stronę "Coming Soon" (Wkrótce otwarcie)?

W okresie przed wielkim otwarciem to właśnie ten ekran widzą wszyscy goście wchodzący na naszą domenę.

1. W lewym menu wybierz **`Strona "Coming Soon" (Zaślepka wkrótce otwarcie)`**.
2. Możesz edytować:
   * **Etykietę z adresem:** np. `Stefana Jaracza 77B Wrocław`
   * **Główny tytuł:** np. `Bistro Poleczka. Wkrótce otwarcie.`
   * **Tekst powitalny pod linijką:** np. `Trwają ostatnie przygotowania. Do zobaczenia w sierpniu na obiadku!`
3. Kliknij **`Publish`**.

---

## ❓ Najczęściej Zadawane Pytania (FAQ)

### Czy mogę zepsuć stronę w panelu CMS?
Nie! Nasz system został zaprojektowany z tzw. *fallbackiem domyślnym*. Jeśli usuniesz jakieś pole lub zostawisz je puste, strona automatycznie użyje domyślnych, bezpiecznych treści zdefiniowanych w kodzie aplikacji. Nie ma ryzyka, że strona przestanie działać.

### Dlaczego po kliknięciu "Publish" zmiana nie jest natychmiast widoczna na moim telefonie?
Przeglądarki internetowe często zapisują strony w pamięci podręcznej (cache). Odśwież stronę kilka razy lub kliknij `Ctrl + Shift + R` (na komputerze) / wyczyść pamięć podręczną w telefonie, a zobaczysz najnowszą wersję.

### Jak odzyskać poprzednią wersję tekstu, jeśli popełniłem błąd?
W prawym górnym rogu panelu Sanity znajduje się ikona zegara (**History** / Historia zmian). Możesz tam podejrzeć poprzednie wersje każdego dokumentu i przywrócić je jednym kliknięciem (`Restore`).
