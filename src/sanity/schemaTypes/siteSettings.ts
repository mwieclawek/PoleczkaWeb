import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Ustawienia Strony (Stopka i Linki)',
  type: 'document',
  fields: [
    defineField({
      name: 'footerDescription',
      title: 'Opis bistro w stopce',
      type: 'text',
      rows: 3,
      initialValue:
        'Nowoczesna kuchnia polska we Wrocławiu. Tradycyjne składniki, nowoczesne techniki — miejsce, gdzie klasyka spotyka się z finezją.',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Link do Instagrama',
      type: 'string',
      initialValue: 'https://instagram.com/poleczka.wroclaw',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Link do Facebooka',
      type: 'string',
      initialValue: 'https://facebook.com/poleczka.wroclaw',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Tekst praw autorskich na dole stopki',
      type: 'string',
      initialValue: 'Bistro Poleczka. Wszystkie prawa zastrzeżone.',
    }),
  ],
})
