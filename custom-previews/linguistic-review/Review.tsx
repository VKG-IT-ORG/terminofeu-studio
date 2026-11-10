import React, { useEffect, useState } from 'react'
import { Stack, Box, Heading, Text } from '@sanity/ui'
import { useClient } from 'sanity'
import styled from 'styled-components'
import { PortableText } from '@portabletext/react'

const Container = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 3rem;
  max-width: 65ch;
  margin: 0 auto;
`

type PortableTextValue = React.ComponentProps<typeof PortableText>['value']

type SourceReference = {
  type?: string
  reference?: { title?: string; url?: string }
}

type EntryContent = {
  definition?: PortableTextValue
  note?: PortableTextValue
  definitionSource?: SourceReference
  notesSource?: SourceReference
}

type EntryDocument = {
  deTitle?: string
  frTitle?: string
  content?: { de?: EntryContent; fr?: EntryContent }
  notes?: { author?: string }[]
}

type ReviewProps = {
  document: { published?: EntryDocument; draft?: EntryDocument }
  documentId: string
}

function Review({ document, documentId }: ReviewProps) {
  const { published, draft } = document

  if (!published) {
    return (
      <Box padding={4}>
        <Text size={2}>Der Eintrag wurde noch nie veröffentlicht.</Text>{' '}
      </Box>
    )
  }

  if (!draft?.content?.fr && !published?.content?.fr) {
    return (
      <Box padding={4}>
        <Text size={2}>Aucun contenu en français.</Text>{' '}
      </Box>
    )
  }

  const comments = published.notes || []

  const isComment = comments.some((comment) => comment.author === 'Jérôme Pott')

  const [definitionSource, setDefinitionSource] = useState<SourceReference>()
  const [noteSource, setNoteSource] = useState<SourceReference>()

  const client = useClient().withConfig({ apiVersion: '2023-01-19' })

  useEffect(() => {
    const query = /* groq */ `*[_id == $id][0] {
      content {
      fr {
        definitionSource {
          type,
          reference->{title, url}
        },
      notesSource {
          type,
          reference->{title, url}
        }
  }
  }
}`

    const params = { id: documentId }

    client
      .fetch<{
        content?: {
          fr?: {
            definitionSource?: SourceReference
            notesSource?: SourceReference
          }
        }
      }>(query, params)
      .then((sources) => {
        const definitionSource = sources.content?.fr?.definitionSource
        if (definitionSource?.reference?.title) {
          setDefinitionSource(definitionSource)
        }

        const noteSource = sources.content?.fr?.notesSource
        if (noteSource?.reference?.title) {
          setNoteSource(noteSource)
        }
      })
      .catch((error) => console.error(error))
  }, [])

  function referenceType(type?: string) {
    if (!type) {
      return ''
    } else if (type === 'original') {
      return 'Définition reprise verbatim de '
    } else if (type === 'after') {
      return 'Définition adaptée de '
    } else {
      return ''
    }
  }

  function renderText(blocks?: PortableTextValue) {
    return blocks ? <PortableText value={blocks} /> : ''
  }

  return (
    <Container>
      <Box paddingBottom={4}>
        {isComment ? (
          <Text weight="semibold">
            Jérôme a laissé un commentaire dans l'onglet Kommentare.
          </Text>
        ) : (
          ''
        )}
      </Box>
      {draft ? (
        <Box>
          <Stack gap={3}>
            <Heading as="h2" size={6}>
              {draft.deTitle}
            </Heading>
            <Heading as="h2" size={6}>
              {draft.frTitle}
            </Heading>

            <Text size={3}>{renderText(draft.content?.de?.definition)}</Text>
            <Text size={3}>{renderText(draft.content?.fr?.definition)}</Text>
          </Stack>

          <Stack gap={4}>
            <Text size={2}>{renderText(draft.content?.de?.note)}</Text>
            <Text size={2}>{renderText(draft.content?.fr?.note)}</Text>
          </Stack>
        </Box>
      ) : (
        <Stack gap={3}>
          <Heading as="h2" size={6}>
            {published.deTitle}
          </Heading>

          <Heading as="h2" size={6}>
            {published.frTitle}
          </Heading>

          <Stack gap={2} paddingBottom={6}>
            <Text size={3}>{renderText(published.content?.de?.definition)}</Text>
            <Text size={3}>{renderText(published.content?.fr?.definition)}</Text>
            {definitionSource && (
              <Text size={2}>
                {referenceType(definitionSource.type)}
                {definitionSource.reference?.url ? (
                  <a href={definitionSource.reference.url} target="_blank">
                    {definitionSource.reference?.title}
                  </a>
                ) : (
                  <span>{definitionSource.reference?.title}</span>
                )}
              </Text>
            )}
          </Stack>

          <Stack gap={4}>
            <Text size={2}>{renderText(published.content?.de?.note)}</Text>
            <Text size={2}>{renderText(published.content?.fr?.note)}</Text>
            {noteSource && (
              <Text size={2} muted>
                {referenceType(noteSource.type)}
                {noteSource.reference?.url ? (
                  <a href={noteSource.reference.url} target="_blank">
                    {noteSource.reference?.title}
                  </a>
                ) : (
                  <span>{noteSource.reference?.title}</span>
                )}
              </Text>
            )}
          </Stack>
        </Stack>
      )}
    </Container>
  )
}

export default Review
