import { defineField, defineType } from 'sanity'

export const comingSoonType = defineType({
  name: 'comingSoon',
  title: 'Strona "Coming Soon" (Zaślepka wkrótce otwarcie)',
  type: 'document',
  fields: [
    defineField({
      name: 'addressTag',
      title: 'Etykieta z adresem nad nagłówkiem',
      type: 'string',
      initialValue: 'Stefana Jaracza 77B Wrocław',
    }),
    defineField({
      name: 'mainTitle',
      title: 'Główny tytuł zaślepki',
      type: 'string',
      initialValue: 'Bistro Poleczka. Wkrótce otwarcie.',
    }),
    defineField({
      name: 'description',
      title: 'Tekst powitalny pod linijką',
      type: 'text',
      rows: 2,
      initialValue: 'Trwają ostatnie przygotowania. Do zobaczenia w sierpniu na obiadku!',
    }),
  ],
})
