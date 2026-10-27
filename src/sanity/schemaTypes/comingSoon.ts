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
      initialValue: 'Otwarcie 3 września!',
    }),
    defineField({
      name: 'description',
      title: 'Tekst powitalny pod linijką',
      type: 'text',
      rows: 2,
      initialValue: 'Widzimy się na obiedzie!',
    }),
    defineField({
      name: 'email',
      title: 'Adres e-mail do kontaktu',
      type: 'string',
      initialValue: 'kontakt@bistropoleczka.pl',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Link do Instagrama na ekranie powitalnym',
      type: 'string',
      initialValue: 'https://instagram.com/bistro.poleczka',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Link do Facebooka na ekranie powitalnym',
      type: 'string',
      initialValue: 'https://www.facebook.com/profile.php?id=61591397017136',
    }),
  ],
})
