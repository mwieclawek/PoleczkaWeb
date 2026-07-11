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
