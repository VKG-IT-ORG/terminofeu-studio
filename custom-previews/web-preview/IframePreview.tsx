import React from 'react'
import { assemblePageUrl } from './assemblePageUrl'
import styled from 'styled-components'

const Message = styled.p`
  padding: 1em;
`
const Preview = styled.div`
  iframe {
    border: 0;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }
`

function IframePreview({
  document,
}: {
  document: { displayed?: { _id: string; _type: string } }
}) {
  const { displayed } = document
  if (!displayed) {
    return <Message>There is no document to preview</Message>
  }

  if (displayed._id.startsWith('drafts')) {
    return (
      <Message>
        Sie müssen zuerst den Eintrag veröffentlichen, damit sie die Vorschau
        aktivieren können.
      </Message>
    )
  }

  const url = assemblePageUrl(displayed)

  if (!url) {
    return (
      <Message>
        Hmm. Having problems constructing the web front-end URL.
      </Message>
    )
  }

  return (
    <Preview>
      <iframe src={url} frameBorder={'0'} />
    </Preview>
  )
}

export default IframePreview
