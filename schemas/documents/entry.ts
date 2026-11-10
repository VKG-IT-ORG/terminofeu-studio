import { AiOutlineContainer } from 'react-icons/ai'
import { ALL_FIELDS_GROUP, defineArrayMember, defineField, defineType } from 'sanity'

import langFn from '../utils/langFn'
import { langs } from '../data/langs'
import { statusList } from '../data/statusList'
import { translationStatusList } from '../data/translationStatusList'
import { ag } from '../data/arbeitsgruppen'

export default defineType({
  name: 'entry',
  title: 'Eintrag',
  type: 'document',
  icon: AiOutlineContainer,
  fieldsets: [
    {
      name: 'admin',
      title: 'Verwaltungsdaten',
    },
  ],
  fields: [
    defineField({
      type: 'string',
      name: 'status',
      title: 'Bearbeitungsstatus',
      options: {
        list: statusList,
      },
      validation: (Rule) => Rule.required().error('Pflichtfeld'),
      fieldset: 'admin',
    }),
    defineField({
      type: 'string',
      name: 'level',
      title: 'Stufe',
      fieldset: 'admin',
      options: {
        list: [
          { title: 'BSV 2026 Anhang 2', value: 'IOTH' },
          { title: 'VKF-Begriff', value: 'VKF' },
        ],
      },
    }),
    defineField({
      title: 'Übersetzungstatus',
      type: 'string',
      name: 'translationStatus',
      fieldset: 'admin',
      options: {
        list: translationStatusList,
      },
    }),
    defineField({
      title: 'AG-Zuordnung',
      name: 'assignees',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      fieldset: 'admin',
      options: {
        list: ag,
        layout: 'grid',
      },
    }),

    ...langs.map(({ title, code }) => {
      return defineField({
        title,
        type: 'string',
        name: code + 'Title',
        hidden: true,
      })
    }),
    defineField({
      name: 'content',
      type: 'object',
      title: 'Sprachauswahl',
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
        {
          ...ALL_FIELDS_GROUP,
          hidden: true,
        },
      ],
      fields: langs.map((lang) => langFn(lang)),
    }),
    defineField({
      title: 'Kommentare',
      name: 'notes',
      type: 'array',
      of: [defineArrayMember({ type: 'note' })],
      options: {
        sortable: false,
      },
    }),
    defineField({
      title: 'Abbildungen',
      name: 'illustrations',
      type: 'array',
      description: 'Zeichnungen, grafische Darstellungen oder Schemata',
      of: [defineArrayMember({ type: 'illustration' })],
    }),

    defineField({
      name: 'approvals',
      title: 'Soll der Begriff bzw. das Konzept in Entwurf übernommen werden?',
      type: 'array',
      of: [defineArrayMember({ type: 'approval' })],
      options: {
        sortable: false,
      },
    }),
  ],
  initialValue: {
    status: statusList[1].value,
  },
  preview: {
    select: {
      title: 'content.de.terms.0.designation',
      subtitle: 'content.fr.terms.0.designation',
      description: 'content.it.terms.0.designation',
    },
  },
  orderings: [
    {
      title: 'DE A->Z',
      name: 'deAlphabetical',
      by: [{ field: 'content.de.terms[0].designation', direction: 'asc' }],
    },
    {
      title: 'FR A->Z',
      name: 'frAlphabetical',
      by: [{ field: 'content.fr.terms[0].designation', direction: 'asc' }],
    },
  ],
})
