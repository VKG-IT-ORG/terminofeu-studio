const statusList = [
  { title: 'Definition', value: 'main' },
  { title: 'Alternative Definition', value: 'variant' },
]

import { filter } from '../utils/sourceFn'
import { defineField, defineType } from 'sanity'

type DefinitionBlock = {
  _type: string
  children?: { _type: string; text?: string }[]
}

export default defineType({
  title: 'Definition',
  name: 'definition',
  type: 'object',
  fields: [
    defineField({
      // TODO: Delete field if no longer needed in the future
      type: 'string',
      name: 'status',
      title: 'Status',
      hidden: true,
      options: {
        list: statusList,
      },
    }),
    defineField({
      title: 'Quelle',
      name: 'source',
      type: 'reference',
      validation: (Rule) =>
        Rule.required().error('Quelle fehlt bei der Definition'),
      to: [{ type: 'source' }],
      options: {
        filter: filter,
      },
    }),
    defineField({
      title: 'Definition',
      name: 'definition',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      blocks: 'definition',
      shortTitle: 'source.title',
      longTitle: 'source.longTitle',
    },
    prepare({
      blocks,
      shortTitle,
      longTitle,
    }: {
      blocks?: DefinitionBlock[]
      shortTitle?: string
      longTitle?: string
    }) {
      const block = (blocks || []).find((block) => block._type === 'block')

      const subtitle = longTitle ? longTitle : shortTitle

      return {
        title: block
          ? (block.children ?? [])
              .filter((child) => child._type === 'span')
              .map((span) => span.text)
              .join('')
          : 'Keine Definition',
        subtitle,
      }
    },
  },
})
