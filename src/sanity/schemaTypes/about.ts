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
      initialValue: 'Kim jesteśmy',
    }),
    defineField({
      name: 'heading',
      title: 'Nagłówek sekcji',
      type: 'string',
      initialValue: 'O nas',
    }),
    defineField({
      name: 'history',
      title: 'Treść historii bistro (akapity)',
      type: 'array',
      of: [{ type: 'text', rows: 4 }],
      initialValue: [
        'Bistro Poleczka to miejsce, które powstało z miłości do jedzenia i chęci dzielenia się nim z innymi. Tworzone przez trójkę przyjaciół, jest realizacją naszego wieloletniego marzenia o własnym miejscu, w którym będziemy mogli Was gościć. ',
        'Sercem Bistro Poleczka jest autorskie ujęcie tradycyjnej kuchni polskiej, bazujące na lokalnych i sezonowych produktach. Zamiast sztywnych ram czy nowoczesnych haseł typu fusion, serwujemy własne spojrzenie na wyjątkowe kompozycje smakowe oraz świeże odsłony polskich klasyków. ',
        'W środku czeka na Was luźna i niezwykle przyjazna atmosfera – dbamy o to, aby każdy z naszych gości czuł się u nas w pełni komfortowo i jak u siebie. Zapraszamy! ',
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
          title: 'Bistro Poleczka to nasze spełnione marzenie',
          text: 'Jesteśmy trójką przyjaciół, którzy po prostu kochają dobrze zjeść i chcą się tą miłością z Wami dzielić.',
        },
        {
          title: 'Bez zadęcia',
          text: 'Bez sztywnych reguł i bez udawania, że to skomplikowane „fusion”.',
        },
        {
          title: 'Gotujemy z tego, co lokalne i sezonowe',
          text: 'Odświeżając polskie klasyki tak, jak lubimy najbardziej – z pomysłem i od serca.',
        },
        {
          title: 'Rozgośćcie się!',
        },
      ],
    }),
  ],
})
