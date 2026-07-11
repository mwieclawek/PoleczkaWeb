import { defineField, defineType } from 'sanity'

export const heroType = defineType({
  name: 'hero',
  title: 'Sekcja "Hero" (Główny baner na górze strony)',
  type: 'document',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Mały napis nad tytułem (Tagline)',
      type: 'string',
      initialValue: 'Wrocław · ul. Jaracza 77B',
    }),
    defineField({
      name: 'titleLine1',
      title: 'Tytuł - Pierwsza linijka (Kolor akcentowy rurowy/różowy)',
      type: 'string',
      initialValue: 'Polska kuchnia.',
    }),
    defineField({
      name: 'titleLine2',
      title: 'Tytuł - Druga linijka (Kolor burgundowy)',
      type: 'string',
      initialValue: 'Rzemiosło, tradycja,',
    }),
    defineField({
      name: 'titleLine3',
      title: 'Tytuł - Trzecia linijka (Kolor burgundowy)',
      type: 'string',
      initialValue: 'nowoczesność.',
    }),
    defineField({
      name: 'subtitle',
      title: 'Podtytuł pod nagłówkiem',
      type: 'text',
      rows: 3,
      initialValue: 'Autorskie spojrzenie na lokalne produkty. Proste składniki podniesione do rangi sztuki kulinarnej.',
    }),
    defineField({
      name: 'ctaPrimaryText',
      title: 'Tekst głównego przycisku (np. Zobacz menu)',
      type: 'string',
      initialValue: 'Zobacz menu',
    }),
    defineField({
      name: 'ctaPrimaryHref',
      title: 'Link głównego przycisku',
      type: 'string',
      initialValue: '#menu',
    }),
    defineField({
      name: 'ctaSecondaryText',
      title: 'Tekst drugiego przycisku (np. Zarezerwuj stolik)',
      type: 'string',
      initialValue: 'Zarezerwuj stolik',
    }),
    defineField({
      name: 'ctaSecondaryHref',
      title: 'Link drugiego przycisku',
      type: 'string',
      initialValue: '#contact',
    }),
  ],
})
