import { filter } from '../utils/sourceFn'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'sourceReference',
  title: 'source',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: true,
  },
  fields: [
    defineField({
      name: 'reference',
      title: 'Quelle',
      type: 'reference',
      to: [{ type: 'source' }],
      options: {
        filter: filter,
      },
    }),
    defineField({
      type: 'string',
      name: 'type',
      title: 'Verweis',
      options: {
        list: [
          { title: 'überarbeitete Quelle', value: 'after' },
          { title: 'wörtlich übernommen', value: 'original' },
        ],
      },
    }),
  ],
})
