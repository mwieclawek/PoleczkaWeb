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
      initialValue: 'Bistro Poleczka kuchnia polska',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Adres e-mail kontaktowy w stopce',
      type: 'string',
      initialValue: 'kontakt@bistropoleczka.pl',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Link do Instagrama',
      type: 'string',
      initialValue: 'https://instagram.com/bistro.poleczka',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Link do Facebooka',
      type: 'string',
      initialValue: 'https://www.facebook.com/profile.php?id=61591397017136',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Tekst praw autorskich na dole stopki',
      type: 'string',
      initialValue: 'Bistro Poleczka. Wszystkie prawa zastrzeżone.',
    }),
  ],
})
