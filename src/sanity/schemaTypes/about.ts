import { defineField, defineType } from 'sanity'

export const aboutType = defineType({
  name: 'about',
  title: 'Sekcja "O nas" (About)',
  type: 'document',
  fields: [
    defineField({
      name: 'subtitle',
      title: 'Podtytuł nad nagłówkiem',
      type: 'string',
      initialValue: 'O nas',
    }),
    defineField({
      name: 'heading',
      title: 'Nagłówek sekcji',
      type: 'string',
      initialValue: 'Szacunek do produktu',
    }),
    defineField({
      name: 'grandOpeningDate',
      title: 'Data wielkiego otwarcia',
      type: 'string',
      initialValue: 'Lipiec 2026',
    }),
    defineField({
      name: 'history',
      title: 'Treść historii bistro (akapity)',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      initialValue: [
        'Poleczka to miejsce stworzone z pasji do prawdziwego jedzenia. Nie idziemy na skróty. Wierzymy, że to, co najlepsze w polskiej kuchni, leży w naturze i rzemiośle.',
        'Nasz seler pieczemy przez długie godziny w masie solnej i kawie, by wydobyć z niego głębię smaku umami. Własnoręcznie zagniatamy ciasto na kluski śląskie i leniwe, a nasze sosy opierają się na głębokich, redukowanych bulionach i palonym maśle.',
        'W sercu wrocławskiego Śródmieścia, przy ulicy Jaracza, stworzyliśmy przestrzeń bez zadęcia. Z intymnym patio, na którym czas płynie wolniej. To nie jest po prostu restauracja. To nasza wizja polskiej gościnności — gdzie każdy talerz to efekt precyzji, wiedzy i szacunku do lokalnego produktu.',
      ],
    }),
    defineField({
      name: 'principles',
      title: 'Nasze filary / Zasady (kafelki pod historią)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'principle',
          fields: [
            defineField({ name: 'title', title: 'Tytuł filaru', type: 'string' }),
            defineField({ name: 'text', title: 'Opis filaru', type: 'text', rows: 3 }),
          ],
        },
      ],
      initialValue: [
        {
          title: 'Lokalne składniki',
          text: 'Współpracujemy z dolnośląskimi rolnikami i dostawcami. Karp milicki, sery od lokalnych serowarów, sezonowe warzywa — każdy produkt ma swoją historię.',
        },
        {
          title: 'Rzemieślnicze techniki',
          text: 'Sous-vide, pieczenie w masie solnej, fermentacja, palenie masła. Tradycyjne smaki podane w bezkompromisowej, nowoczesnej formie.',
        },
        {
          title: 'Patio na Jaracza',
          text: 'W sezonie zapraszamy na zaciszne patio — kameralna przestrzeń w centrum Wrocławia, gdzie jedzenie na świeżym powietrzu nabiera innego wymiaru.',
        },
        {
          title: 'Bez zadęcia',
          text: 'Gotujemy z precyzją i wiedzą, ale serwujemy bez pretensji. Chcemy, żebyś czuł się jak u siebie — tyle że jedzenie jest lepsze.',
        },
      ],
    }),
  ],
})
