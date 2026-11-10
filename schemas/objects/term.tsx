import React from 'react'
import { AiOutlineFileText } from 'react-icons/ai'
import { defineField, defineType } from 'sanity'

import { filter } from '../utils/sourceFn'

export default defineType({
  title: 'Begriff',
  name: 'term',
  type: 'object',
  icon: AiOutlineFileText,
  fieldsets: [
    {
      name: 'abbreviation',
      title: 'Kurzform (falls vorhanden)',
      options: {
        collapsible: true,
        collapsed: true,
      },
    },
  ],
  fields: [
    defineField({
      type: 'string',
      name: 'status',
      title: 'Status',
      options: {
        list: [
          { title: 'Hauptbegriff', value: 'main' },
          { title: 'Alternativ', value: 'variant' },
          { title: 'Zu vermeiden', value: 'avoid' },
          { title: 'Noch zu bestimmen', value: 'to_be_defined' },
        ],
      },
    }),
    defineField({
      title: 'Quelle',
      name: 'source',
      type: 'reference',
      to: [{ type: 'source' }],
      validation: (Rule) => Rule.required().error('Quelle fehlt beim Begriff'),
      options: {
        filter: filter,
      },
    }),
    defineField({
      title: 'Begriff',
      name: 'designation',
      type: 'string',
      description:
        'Begriffe sind in ihrer Grundform (z.B. Nominativ Singular) zu erfassen.',
    }),
    defineField({
      title: 'Quelle',
      name: 'abbreviationSource',
      type: 'reference',
      fieldset: 'abbreviation',
      to: [{ type: 'source' }],
      options: {
        filter: filter,
      },
    }),
    defineField({
      title: 'Abkürzung / Akronym / Silbenkurzwort',
      name: 'abbreviation',
      type: 'string',
      fieldset: 'abbreviation',
    }),
  ],
  preview: {
    select: {
      term: 'designation',
      abbreviation: 'abbreviation',
      shortTitle: 'source.title',
      longTitle: 'source.longTitle',
      status: 'status',
    },
    prepare({ shortTitle, longTitle, term, abbreviation, status }) {
      const EMOJIS: Record<string, string> = {
        main: '✌️',
        variant: '👍',
        avoid: '👎',
        to_be_defined: '❓',
      }

      const title = abbreviation ? `${term} (${abbreviation})` : term

      const subtitle = longTitle ? longTitle : shortTitle

      return {
        title,
        subtitle,
        media: (
          <span style={{ fontSize: '1.5rem' }}>
            {status ? EMOJIS[status] : '✌️'}
          </span>
        ),
      }
    },
  },
})
