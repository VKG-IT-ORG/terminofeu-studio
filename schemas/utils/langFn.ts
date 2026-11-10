import { defineArrayMember, defineField } from 'sanity'

export default ({ title, code }: { title: string; code: string }) => {
  return defineField({
    title,
    name: code,
    type: 'object',
    group: code,
    fields: [
      defineField({
        type: 'array',
        name: 'terms',
        title: 'Benennung',
        of: [defineArrayMember({ type: 'term' })],
      }),
      defineField({
        name: 'definition',
        title: 'Definition BSV 2026',
        type: 'blockContent',
      }),
      defineField({
        name: 'definitionSource',
        title: 'Quelle der Definition',
        type: 'sourceReference',
      }),
      defineField({
        name: 'note',
        title: 'Anmerkungen',
        type: 'noteRedactor',
      }),
      defineField({
        name: 'notesSource',
        title: 'Quelle der Anmerkung',
        type: 'sourceReference',
      }),
      defineField({
        name: 'examples',
        title: 'Beispiele',
        type: 'noteRedactor',
      }),
      defineField({
        title: 'Definitionen aus bestehenden Regelwerken',
        name: 'definitions',
        type: 'array',
        of: [defineArrayMember({ type: 'definition' })],
        options: {
          sortable: false,
        },
      }),
    ],
  })
}
