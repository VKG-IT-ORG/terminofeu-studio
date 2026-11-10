import illustrationFn from '../utils/illustrationFn'
import { langs } from '../data/langs'
import { defineField, defineType } from 'sanity'

export default defineType({
  title: 'Bild',
  name: 'illustration',
  type: 'object',
  fields: [
    defineField({
      title: 'Quelle der Abbildung',
      name: 'source',
      type: 'reference',
      validation: (Rule) =>
        Rule.required().error('Quelle fehlt bei der Abbildung'),
      to: [{ type: 'source' }],
    }),
    defineField({
      type: 'image',
      title: 'Abbildung',
      name: 'image',
      description: 'Sprachneutrale Abbildung mit Nummerierung',
    }),
    defineField({
      name: 'content',
      type: 'object',
      groups: [
        {
          name: 'de',
          title: 'Deutsch',
          default: true,
        },
        {
          name: 'fr',
          title: 'Französisch',
        },
        {
          name: 'it',
          title: 'Italienisch',
        },
      ],
      fields: langs.map((lang) => illustrationFn(lang)),
    }),
  ],
  preview: {
    select: {
      media: 'image',
      title: 'content.de.title',
    },
    prepare({ title, media }) {
      return {
        media,
        title,
      }
    },
  },
})
