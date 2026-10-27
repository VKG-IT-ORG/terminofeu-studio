import React, { useEffect, useState } from 'react'
import { PortableText } from '@portabletext/react'
import { Box, Heading, Spinner, Text, Stack } from '@sanity/ui'
import { useClient } from 'sanity'
import styled from 'styled-components'

const TableWrapper = styled.div`
  overflow-x: auto;
`

const TermsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th,
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--card-border-color, #d8d8d8);
    vertical-align: top;
  }

  th {
    font-weight: 600;
  }

  td {
    min-width: 12rem;
  }

  td:first-child {
    min-width: 14rem;
  }
`

const portableTextComponents = {
  marks: {
    sup: ({ children }) => <sup>{children}</sup>,
    linkToEntry: ({ children }) => <span>{children}</span>,
  },
}

const groqQuery = `
*[_type == 'entry' && !(_id in path('drafts.**')) && level == 'IOTH' && status == 'approved'] | order(content.de.terms[0].designation asc) {
  _id,
  'terms': content.de.terms[]{_key, designation, abbreviation, status},
  'definition': content.de.definition,
  'note': content.de.note
}
`

const listenQuery =
  "*[_type == 'entry' && !(_id in path('drafts.**')) && level == 'IOTH' && status == 'approved']"

function Anhang2() {
  const [rows, setRows] = useState([])
  const [entryCount, setEntryCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const sanityClient = useClient({ apiVersion: '2026-10-27' })

  useEffect(() => {
    let cancelled = false
    let requestId = 0

    const refreshRows = () => {
      const currentRequestId = ++requestId
      sanityClient
        .fetch(groqQuery)
        .then((entries) => {
          if (cancelled || currentRequestId !== requestId) return

          setEntryCount(entries.length)
          const rows = entries
            .map((entry) => {
              const terms = entry.terms || []
              const vedetteIndex = terms.findIndex(
                (term) => term.status === 'main'
              )
              const orderedTerms =
                vedetteIndex > 0
                  ? [
                      terms[vedetteIndex],
                      ...terms.filter((_, index) => index !== vedetteIndex),
                    ]
                  : terms

              return {
                key: entry._id,
                terms: orderedTerms,
                definition: entry.definition,
                note: entry.note,
              }
            })
            .filter((row) => row.terms.length > 0)
            .sort((a, b) =>
              (a.terms[0].designation || '').localeCompare(
                b.terms[0].designation || '',
                'de'
              )
            )

          setRows(rows)
          setError(null)
        })
        .catch((fetchError) => {
          console.error(
            'Fehler beim Laden der Begriffe für Anhang 2:',
            fetchError
          )
          if (!cancelled && currentRequestId === requestId) {
            setError(fetchError.message || String(fetchError))
          }
        })
        .finally(() => {
          if (!cancelled && currentRequestId === requestId) setLoading(false)
        })
    }

    const subscription = sanityClient
      .listen(listenQuery, {}, { visibility: 'query' })
      .subscribe({
        next: refreshRows,
        error: (listenError) => {
          console.error(
            'Echtzeitaktualisierungen für Anhang 2 fehlgeschlagen:',
            listenError
          )
          if (!cancelled) {
            setError(
              `Echtzeitaktualisierungen fehlgeschlagen: ${
                listenError.message || String(listenError)
              }`
            )
          }
        },
      })

    refreshRows()

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [sanityClient])

  return (
    <Box padding={4}>
      <Box marginBottom={4}>
        <Heading as="h1" size={2}>
          Anhang 2 – Begriffe
        </Heading>
      </Box>

      {loading ? (
        <Box display="flex" alignItems="center" padding={3}>
          <Spinner />
          <Box marginLeft={3}>
            <Text>Lade Begriffe …</Text>
          </Box>
        </Box>
      ) : error ? (
        <Text>Die Begriffe konnten nicht geladen werden: {error}</Text>
      ) : (
        <>
          <Box marginBottom={3}>
            <Text muted>
              {entryCount} {entryCount === 1 ? 'Eintrag' : 'Einträge'}
            </Text>
          </Box>
          {rows.length === 0 ? (
            <Text>Keine Begriffe gefunden.</Text>
          ) : (
            <TableWrapper>
              <TermsTable>
                <thead>
                  <tr>
                    <th scope="col">Begriff</th>
                    <th scope="col">Bedeutung</th>
                    <th scope="col">Erläuterung/Beispiele/Anmerkungen</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.key}>
                      <td>
                        <Stack gap={2}>
                          {row.terms.map((term, index) => (
                            <Text
                              key={term._key || `${row.key}-${index}`}
                              muted={index > 0}
                              size={index > 0 ? 1 : 2}
                            >
                              {index > 0
                                ? `(${term.designation || '—'})`
                                : term.designation || '—'}
                              {term.abbreviation && ` (${term.abbreviation})`}
                            </Text>
                          ))}
                        </Stack>
                      </td>
                      <td>
                        {Array.isArray(row.definition) &&
                        row.definition.length > 0 ? (
                          <PortableText
                            value={row.definition}
                            components={portableTextComponents}
                          />
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>
                        {Array.isArray(row.note) && row.note.length > 0 ? (
                          <PortableText
                            value={row.note}
                            components={portableTextComponents}
                          />
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TermsTable>
            </TableWrapper>
          )}
        </>
      )}
    </Box>
  )
}

export default {
  name: 'anhang-2',
  title: 'Anhang 2',
  component: Anhang2,
}
