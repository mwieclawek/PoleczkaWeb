import { defineField, defineType } from 'sanity'

export const menuType = defineType({
  name: 'menuSection',
  title: 'Sekcja "Menu" (Karta dań na stronie)',
  type: 'document',
  fields: [
    defineField({
      name: 'seasonTag',
      title: 'Tag sezonowy (np. Sezon: Lato 2026)',
      type: 'string',
      initialValue: 'Sezon: Lato 2026',
    }),
    defineField({
      name: 'title',
      title: 'Tytuł sekcji (np. Menu Letnie)',
      type: 'string',
      initialValue: 'Menu Letnie',
    }),
    defineField({
      name: 'description',
      title: 'Opis sekcji (wprowadzenie do menu)',
      type: 'text',
      rows: 3,
      initialValue:
        'Korzystamy z pełni polskiego lata. W tej karcie znajdziecie botwinkę, młody bób, fasolkę szparagową i owoce jagodowe z lokalnych zbiorów. Pracujemy z naturą, dlatego nasze menu zmienia się wraz z porami roku.',
    }),
    defineField({
      name: 'categories',
      title: 'Kategorie w menu (np. Przystawki, Zupy, Dania główne)',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Kategoria',
          fields: [
            defineField({
              name: 'key',
              title: 'Klucz kategorii (np. przystawki - bez spacji i polskich znaków)',
              type: 'string',
            }),
            defineField({
              name: 'label',
              title: 'Nazwa widoczna w zakładce (np. Przystawki)',
              type: 'string',
            }),
            defineField({
              name: 'items',
              title: 'Pozycje w tej kategorii',
              type: 'array',
              of: [
                {
                  type: 'object',
                  title: 'Danie / Napój',
                  fields: [
                    defineField({
                      name: 'name',
                      title: 'Nazwa dania',
                      type: 'string',
                    }),
                    defineField({
                      name: 'description',
                      title: 'Opis składników',
                      type: 'text',
                      rows: 2,
                    }),
                    defineField({
                      name: 'price',
                      title: 'Cena w zł (liczba)',
                      type: 'number',
                    }),
                    defineField({
                      name: 'highlighted',
                      title: 'Wyróżnij jako "Klasyk Poleczki" (pionowy czerwony pasek i etykieta)',
                      type: 'boolean',
                      initialValue: false,
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
      initialValue: [
        {
          key: 'przystawki',
          label: 'Przystawki',
          items: [
            {
              name: 'Seler pieczony w soli i kawie / Café de Paris',
              description:
                'Stek z korzenia selera pieczony przez długie godziny w masie solnej i kawie | gorący sos Café de Paris z anchois i kaparami',
              price: 39,
              highlighted: true,
            },
            {
              name: 'Kiełbasa śląska duszona w cydrze',
              description:
                'Rzemieślnicza kiełbasa duszona w cydrze ze Wzgórz Trzebnickich | świeże pieczywo | aromatyczny sos z redukcji',
              price: 28,
              highlighted: false,
            },
            {
              name: 'Krem z wędzonego twarogu z botwinką',
              description:
                'Aksamitny krem z twarogu wędzonego | smażona botwinka i buraczki z patelni | świeże zioła | rzemieślnicze pieczywo',
              price: 26,
              highlighted: false,
            },
            {
              name: 'Gofr ziemniaczany z wędzonym karpiem',
              description:
                'Chrupiący gofr z tartych ziemniaków | wędzony karp milicki z Doliny Baryczy | autorski majonez koperkowy i grzybowy',
              price: 36,
              highlighted: true,
            },
            {
              name: 'Pasztet z karmelizowaną cebulą',
              description:
                'Domowy pasztet mięsny | słodko-kwaśna karmelizowana cebula | chrupiące pikle | olej szczypiorkowy | świeże pieczywo',
              price: 32,
              highlighted: false,
            },
            {
              name: 'Smalec i masło ziołowe z pieczywem',
              description:
                'Domowy smalec ze skwarkami | krem z wędzonego twarogu | rzemieślnicze masło z solą morską i ziołami | świeże pieczywo',
              price: 24,
              highlighted: false,
            },
          ],
        },
        {
          key: 'zupy',
          label: 'Zupy',
          items: [
            {
              name: 'Domowy rosół na kaczce',
              description:
                'Esencjonalny bulion na korpusach z kaczki i palonych warzywach | makaron z naleśnika razowego (graham) | świeży olej szczypiorkowy',
              price: 24,
              highlighted: false,
            },
            {
              name: 'Letnia botwinka z zielonymi kluskami',
              description:
                'Tradycyjna letnia zupa z młodych buraków | zielone kluski lane ze szpinakiem | koperek | kwaśna śmietana',
              price: 26,
              highlighted: false,
            },
            {
              name: 'Krem z pieczonego selera',
              description:
                'Aksamitna zupa z pieczonego selera i ziemniaków | kawior z pstrąga | mikroliście rzodkiewki',
              price: 29,
              highlighted: true,
            },
          ],
        },
        {
          key: 'glowne',
          label: 'Dania główne',
          items: [
            {
              name: 'Pierś z kaczki z sosem porzeczkowym',
              description:
                'Kaczka sous-vide obsmażana na chrupiąco | sos winno-porzeczkowy z jeżynami | jedwabiste puree z kalafiora | piklowana cebulka',
              price: 68,
              highlighted: true,
            },
            {
              name: 'Kluski śląskie z polikami wieprzowymi',
              description:
                'Ręcznie formowane kluski śląskie z mączystych ziemniaków | rwane poliki wieprzowe w ciemnym, esencjonalnym sosie | chrupiące pikle',
              price: 49,
              highlighted: true,
            },
            {
              name: 'Kluski śląskie z sosem grzybowym',
              description:
                'Ręcznie formowane kluski śląskie | głęboki sos leśny z podgrzybków | chrupka ziołowa z czerstwego chleba lub marynowany akcent',
              price: 44,
              highlighted: false,
            },
            {
              name: 'Klasyczny schabowy na smalcu',
              description:
                'Złocisty kotlet schabowy smażony na smalcu z panko | jedwabiste maślane puree ziemniaczane | mizeria z ogórków gruntowych',
              price: 46,
              highlighted: false,
            },
            {
              name: 'Leniwe z fasolką szparagową',
              description:
                'Domowe kluski z twarogu półtłustego | letnia fasolka szparagowa | chrupka ziołowa | złote palone masło',
              price: 39,
              highlighted: false,
            },
            {
              name: 'Młode ziemniaki z bobem i jajem',
              description:
                'Ziemniaki z wody w mundurkach | bób podsmażany na maśle i szalotce | jajo sadzone | kruszony wędzony twaróg | świeże zioła',
              price: 36,
              highlighted: false,
            },
            {
              name: 'Ziemniaki w mundurkach z puree i kaszą',
              description:
                'Wegetariańska kompozycja: młode ziemniaki w mundurkach | jedwabiste puree ziemniaczane | kasza gryczana | surówki i domowe kiszonki',
              price: 36,
              highlighted: false,
            },
          ],
        },
        {
          key: 'desery',
          label: 'Desery',
          items: [
            {
              name: 'Sezonowe owoce pod maślaną kruszonką',
              description:
                'Gorące owoce jagodowe prosto z sadu | chrupiąca maślana kruszonka | domowa puszysta bita śmietana z prawdziwą wanilią',
              price: 29,
              highlighted: false,
            },
            {
              name: 'Leniwe na słodko z palonym masłem',
              description:
                'Klasyczne kluski twarogowe | palone masło ze złotą bułką tartą | redukowany sos jeżynowy | kwaśna śmietana',
              price: 26,
              highlighted: false,
            },
          ],
        },
        {
          key: 'napoje',
          label: 'Napoje & Spritz',
          items: [
            {
              name: 'Porzeczka Hugo Spritz',
              description:
                'Autorski spritz na bazie prosecco, syropu z czarnej porzeczki, mięty i limonki',
              price: 32,
              highlighted: true,
            },
            {
              name: 'Lawenda & Ogórek Spritz',
              description:
                'Odświeżające koktajle spritz do wyboru: aromatyczny Lawenda Spritz lub wytrawny Spritz Ogórkowy',
              price: 32,
              highlighted: false,
            },
            {
              name: 'Wyselekcjonowane wina & Piwa rzemieślnicze',
              description:
                'Piwo lane i butelkowe z lokalnych browarów | Wina białe (Chardonnay, Vinho Verde) i czerwone (Cabernet, Musaco)',
              price: 22,
              highlighted: false,
            },
            {
              name: 'Lemoniady rzemieślnicze & Napoje',
              description:
                'Soki sezonowe (zapytaj obsługę) | Lipton | Mio Mio | Woda gazowana lub niegazowana',
              price: 16,
              highlighted: false,
            },
            {
              name: 'Kawa z lokalnej palarni & Herbata liściasta',
              description:
                'Kawa (Czarna / Biała / Espresso / Cappuccino) | Herbata (Czarna / Zielona / Owocowa / Ziołowa w czajniczku)',
              price: 14,
              highlighted: false,
            },
          ],
        },
        {
          key: 'dzieci',
          label: 'Dla dzieci',
          items: [
            {
              name: 'Zupa pomidorowa',
              description: 'Klasyka domowego obiadu | drobny makaron',
              price: 16,
              highlighted: false,
            },
            {
              name: 'Mały rosół z kluseczkami',
              description: 'Klarowny bulion | drobne kluseczki lane',
              price: 16,
              highlighted: false,
            },
            {
              name: 'Mini schabowy z puree',
              description:
                'Mniejsza porcja naszego schabowego | jedwabiste puree ziemniaczane',
              price: 24,
              highlighted: false,
            },
            {
              name: 'Leniwe na słodko z masłem i cukrem',
              description: 'Domowe kluski twarogowe | rozpuszczone masło | cukier puder',
              price: 19,
              highlighted: false,
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'footerNote',
      title: 'Notatka pod kartą menu',
      type: 'text',
      rows: 2,
      initialValue: 'Z każdym chłodniejszym dniem przygotowujemy się do nowych zbiorów. Menu jesienne już wkrótce.',
    }),
  ],
})
