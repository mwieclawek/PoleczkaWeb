import { defineField, defineType } from 'sanity'

export const contactType = defineType({
  name: 'contact',
  title: 'Sekcja "Kontakt" i Godziny Otwarcia',
  type: 'document',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Mały napis nad tytułem',
      type: 'string',
      initialValue: 'Kontakt',
    }),
    defineField({
      name: 'title',
      title: 'Nagłówek sekcji',
      type: 'string',
      initialValue: 'Odwiedź nas',
    }),
    defineField({
      name: 'subtitle',
      title: 'Opis pod tytułem',
      type: 'text',
      rows: 2,
      initialValue: 'Znajdziesz nas w samym sercu Wrocławia. Zarezerwuj stolik telefonicznie lub mailowo.',
    }),
    defineField({
      name: 'addressLabel',
      title: 'Adres - etykieta i wartość',
      type: 'string',
      initialValue: 'ul. Stefana Jaracza 77B\n50-305 Wrocław',
    }),
    defineField({
      name: 'googleMapsUrl',
      title: 'Link do Google Maps',
      type: 'string',
      initialValue: 'https://maps.google.com/?q=ul.+Stefana+Jaracza+77B,+50-305+Wrocław',
    }),
    defineField({
      name: 'phone',
      title: 'Numer telefonu',
      type: 'string',
      initialValue: '+48 71 123 45 67',
    }),
    defineField({
      name: 'phoneClean',
      title: 'Numer telefonu do linku (np. +48711234567 bez spacji)',
      type: 'string',
      initialValue: '+48711234567',
    }),
    defineField({
      name: 'email',
      title: 'Adres e-mail',
      type: 'string',
      initialValue: 'kontakt@bistropoleczka.pl',
    }),
    defineField({
      name: 'openingHours',
      title: 'Godziny otwarcia',
      type: 'array',
      of: [
        {
          type: 'object',
          title: 'Dni i godziny',
          fields: [
            defineField({
              name: 'days',
              title: 'Dni (np. Poniedziałek lub Wtorek – Piątek)',
              type: 'string',
            }),
            defineField({
              name: 'hours',
              title: 'Godziny (np. Nieczynne lub 13:00 – 21:30)',
              type: 'string',
            }),
          ],
        },
      ],
      initialValue: [
        { days: 'Poniedziałek', hours: 'Nieczynne' },
        { days: 'Wtorek – Piątek', hours: '13:00 – 21:30' },
        { days: 'Sobota – Niedziela', hours: '13:00 – 22:00' },
      ],
    }),
    defineField({
      name: 'footerNote',
      title: 'Uwaga pod godzinami otwarcia',
      type: 'text',
      rows: 2,
      initialValue: 'W święta oraz dni szczególne godziny mogą ulec zmianie. Sprawdź nasze social media lub zadzwoń, by potwierdzić.',
    }),
  ],
})
