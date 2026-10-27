import { defineField, defineType } from 'sanity'

export const menuType = defineType({
  name: 'menuSection',
  title: 'Sekcja "Menu" (Karta dań na stronie)',
  type: 'document',
  fields: [
    defineField({
      name: 'seasonTag',
      title: 'Tag sezonowy (np. Sezon: Jesień 2026)',
      type: 'string',
      initialValue: 'Sezon: Jesień 2026',
    }),
    defineField({
      name: 'title',
      title: 'Tytuł sekcji (np. Menu Jesienne)',
      type: 'string',
      initialValue: 'Menu Jesienne',
    }),
    defineField({
      name: 'description',
      title: 'Opis sekcji (wprowadzenie do menu)',
      type: 'text',
      rows: 3,
      initialValue: '   ',
    }),
    defineField({
      name: 'categories',
      title: 'Kategorie w menu (np. Dania mniejsze, Zupy, Dania główne)',
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
              title: 'Nazwa widoczna w zakładce (np. Dania mniejsze)',
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
          label: 'Dania mniejsze',
          items: [
            {
              name: 'Trio degustacyjne Poleczki',
              description: 'PYRA Z GZIKIEM / KASZANKA NA CHAŁCE / TATAR',
              price: 90,
              highlighted: true,
            },
            {
              name: 'Trio Pajd',
              description:
                'PÓŁ PAJDY ZE SMALCEM / PÓŁ PAJDY Z PASZTETEM / PÓŁ PAJDY Z WEGE SMALCEM',
              price: 33,
              highlighted: true,
            },
            {
              name: 'Pyra z gzikiem, z borowikiem',
              description:
                'ZIEMNIAK W MUNDURKU / GZIK / BOROWIK Z CEBULKĄ SMAŻONY NA MAŚLE / OLEJ SZCZYPIORKOWY',
              price: 27,
              highlighted: false,
            },
            {
              name: 'Kaszanka na chałce',
              description:
                'KASZANKA SMAŻONA Z CEBULĄ / GRILOWANA CHAŁKA / SALSA Z ZIELONEGO JABŁKA / BOCZEK',
              price: 32,
              highlighted: false,
            },
            {
              name: 'Tatar z antrykotu',
              description:
                'SIEKANY ANTRYKOT WOŁOWY / SZALOTKA / KAPARY / MUSZTARDA DIJON / GRZYB SHIMEJI / MAJONEZ PIETRUSZKOWY / PIECZYWO',
              price: 52,
              highlighted: false,
            },
            {
              name: 'Pajda z pasztetem',
              description:
                'DOMOWY PASZTET / KARMELIZOWANA CEBULA / JEŻYNA / OLEJ KOPERKOWY / PIECZYWO',
              price: 25,
              highlighted: true,
            },
            {
              name: 'Pajda ze smalcem lub wege smalcem',
              description:
                'DOMOWY SMALEC ZE SKWARKAMI I JABŁKIEM / KARMELIZOWANA CEBULA / OGÓREK KISZONY / PIECZYWO',
              price: 18,
              highlighted: false,
            },
          ],
        },
        {
          key: 'zupy',
          label: 'Zupy',
          items: [
            {
              name: 'Rosół z trzech mięs',
              description:
                'BULION Z WOŁOWINY, KURY I KACZKI / MAKARON Z NALEŚNIKA RAZOWEGO / OLEJ SZCZYPIORKOWY / PIETRUSZKA',
              price: 25,
              highlighted: false,
            },
            {
              name: 'Grzybowa',
              description:
                'ZUPA GRZYBOWA NA BULIONIE Z TRZECH MIĘS / KWAŚNA ŚMIETANA / KOPER',
              price: 28,
              highlighted: false,
            },
            {
              name: 'Zupa dnia',
              description: 'ZAPYTAJ OBSŁUGĘ - ZAWSZE WEGE',
              price: 22,
              highlighted: false,
            },
          ],
        },
        {
          key: 'glowne',
          label: 'Dania główne',
          items: [
            {
              name: 'Kremowe kaszotto grzybowe',
              description:
                'KASZA GRYCZANA / GRZYBY LEŚNE / ŚMIETANKA / DYNIA / SER KOZI',
              price: 39,
              highlighted: false,
            },
            {
              name: 'Kotlet schabowy',
              description:
                'SCHAB MARYNOWANY W MLEKU I CEBULI / ZIEMNIACZANE PUREE Z CHRZANEM / KARMELIZOWANA CEBULA',
              price: 39,
              highlighted: true,
            },
            {
              name: 'Korzenne policzki wołowe',
              description:
                'POLICZKI WOŁOWE W PRZYPRAWACH KORZENNYCH / PUREE ZIEMNIACZANE / WARZYWA KORZENNE / DEMI GLACE',
              price: 72,
              highlighted: true,
            },
            {
              name: 'Kluski śląskie z polędwiczką',
              description:
                'KLUSKI ŚLĄSKIE / POLĘDWICZKA WIEPRZOWA / SOS CHRZANOWY / ŻURAWINA / SZCZYPIOR',
              price: 39,
              highlighted: false,
            },
            {
              name: 'Gołąbki z mięsem, pęczakiem i grzybami',
              description:
                'KAPUSTA WŁOSKA / KASZA JĘCZMIENNA / KARKÓWKA WIEPRZOWA / GRZYBY LEŚNE - DOSTĘPNE RÓWNIEŻ WEGE',
              price: 46,
              highlighted: false,
            },
            {
              name: 'Sałatka z pieczonymi warzywami',
              description:
                'SOS Z PIECZONEJ PAPRYKI / MIESZANKA SAŁATY RZYMSKIEJ I CYKORII / GRILOWANE WARZYWA / SER KOZI',
              price: 38,
              highlighted: false,
            },
          ],
        },
        {
          key: 'desery',
          label: 'Desery',
          items: [
            {
              name: 'Rustykalne kluski dyniowe z serem',
              description:
                'KLUSKI DYNIOWE Z TWAROGIEM PODSMAŻANE NA MAŚLE / KREM CYTRYNOWY / JOGURT / KRUSZONA BEZA',
              price: 30,
              highlighted: false,
            },
            {
              name: 'Tost francuski',
              description:
                'CHAŁKA W JAJKU I MLEKU SMAŻONA NA MAŚLE / LODY WANILIOWE / MALINY W CUKRZE',
              price: 33,
              highlighted: false,
            },
          ],
        },
        {
          key: 'dzieci',
          label: 'Dla dzieci',
          items: [
            {
              name: 'Rosołek',
              description: 'ROSÓŁ / MAKARON ZWIERZĄTKA',
              highlighted: false,
            },
            {
              name: 'Zupa pomidorowa',
              description: 'ZUPA POMIDOROWA / MAKARON ZWIERZĄTKA',
              highlighted: false,
            },
            {
              name: 'Nuggetsy z frytkami',
              description: 'DOMOWE NUGGETSY / DOMOWE FRYTKI / KETCHUP',
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
      initialValue:
        'Z każdym chłodniejszym dniem przygotowujemy się do menu zimowego.',
    }),
  ],
})
