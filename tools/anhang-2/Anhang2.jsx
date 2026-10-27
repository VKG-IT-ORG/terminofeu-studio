import React from 'react'
import { useClient } from 'sanity'

const groqQuery = `
*[_type == 'entry' && level == 'IOTH' && status == 'approved'] {
  _id,
  'terms': content.de.terms,
  'definition': content.de.definition,
  'note': content.de.note
}
`

function myCustomTool() {
  const sanityClient = useClient({ apiVersion: '2026-10-27' })
  return <div></div>
}

export default {
  name: 'anhang-2',
  title: 'Anhang 2',
  component: myCustomTool,
}
