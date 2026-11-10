import { defineField } from 'sanity'

export default ({ title, code }: { title: string; code: string }) => {
  return defineField({
    title,
    name: code,
    type: 'object',
    group: code,
    fields: [
      defineField({
        name: 'title',
        type: 'string',
        title: 'Titel',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'caption',
        type: 'blockContent',
        title: 'Bildlegende',
      }),
    ],
  })
}
