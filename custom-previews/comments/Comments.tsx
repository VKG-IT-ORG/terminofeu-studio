import React from 'react'
import { Stack, Card, Label, Box, Heading, Flex } from '@sanity/ui'
import styled from 'styled-components'

const Container = styled.div`
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 3rem;
  max-width: 65ch;
  margin: 0 auto;
`

const NoComment = styled.p`
  font-weight: bolder;
  font-style: italic;
  user-select: none;
`

const Comment = styled.p`
  hyphens: auto;
  line-height: 1.4;
  margin: 0;
  white-space: pre-line;
`

type CommentData = { _key?: string; author?: string; text?: string }

type CommentsProps = {
  document: { displayed: { notes?: CommentData[] } }
}

function Comments({ document }: CommentsProps) {
  function checkComments(comments?: CommentData[]) {
    if (comments) {
      return (
        <Stack gap={[3, 3, 4]} marginBottom={6}>
          <Heading as="h2" size={2}>
            Kommentare
          </Heading>
          <Flex direction="column-reverse">
            {comments.map((comment) => {
              return (
                <Card
                  padding={[3, 3, 4]}
                  radius={2}
                  shadow={1}
                  marginY={2}
                  key={comment._key}
                >
                  <Box marginBottom={3}>
                    <Label size={0}>{comment.author}</Label>
                  </Box>
                  <Comment>{comment.text}</Comment>
                </Card>
              )
            })}
          </Flex>
        </Stack>
      )
    } else {
      return <NoComment>Keine Kommentare</NoComment>
    }
  }

  return (
    <Container lang="de">{checkComments(document.displayed.notes)}</Container>
  )
}

export default Comments
