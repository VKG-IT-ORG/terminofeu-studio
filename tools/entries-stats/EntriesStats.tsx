import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useClient } from 'sanity'
import { statusList } from '../../schemas/data/statusList'
import { translationStatusList } from '../../schemas/data/translationStatusList'
import { Heading, Box } from '@sanity/ui'
import Icon from './icon'

import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const Container = styled.div`
  padding-right: 1rem;
  padding-top: 3rem;
  max-width: min(1000px, 100%);
`

const list = statusList
  .map(
    ({ value }) =>
      `"${value}": count(*[_type == "entry" && status == "${value}"])`
  )
  .join(',')

const list2 = translationStatusList
  .map(
    ({ value }) =>
      `"${value}": count(*[_type == "entry" && translationStatus == "${value}"])`
  )
  .join(',')

const query = `
{
   ${list},
   ${list2}
}`

type StatEntry = { title: string; Anzahl: number; color: string }

function EntriesStats() {
  const [data, setData] = useState<StatEntry[]>([])

  const [data2, setData2] = useState<StatEntry[]>([])

  const sanityClient = useClient({ apiVersion: '2023-01-19' })

  useEffect(() => {
    sanityClient
      .fetch<Record<string, number>>(query)
      .then((counts) => {
        const newData = [
          {
            title: 'Entwurf',
            Anzahl: counts.new_draft,
            color: '#F97316',
          },
          {
            title: 'Definition',
            Anzahl: counts.definition,
            color: '#EAB308',
          },
          {
            title: 'Freigabe',
            Anzahl: counts.approved,
            color: '#84CC16',
          },
          {
            title: 'Kernausschuss',
            Anzahl: counts.validated,
            color: '#10B981',
          },
          {
            title: 'BSV 2026',
            Anzahl: counts.in_force,
            color: '#06B6D4',
          },
        ]
        setData(newData)

        const newData2 = [
          {
            title: 'Übersetzung',
            Anzahl: counts.translation,
            color: '#EF4444',
          },
          {
            title: 'Revision',
            Anzahl: counts.review,
            color: '#F97316',
          },
          {
            title: 'Kontrolle',
            Anzahl: counts.validation,
            color: '#EAB308',
          },
          {
            title: 'Freigabe',
            Anzahl: counts.fr_validated,
            color: '#84CC16',
          },
        ]

        setData2(newData2)
      })
      .catch((error) => console.error(error))
  }, [])

  return (
    <Container>
      <Box marginBottom={4} marginLeft={5}>
        <Heading as="h2" size={2}>
          Einträgeanzahl je nach Status
        </Heading>
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Anzahl">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Box marginBottom={4} marginLeft={5} marginTop={6}>
        <Heading as="h2" size={2}>
          Stand des Übersetzungsprozesses ins Französisch
        </Heading>
      </Box>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data2}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="Anzahl">
            {data2.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Container>
  )
}

export default {
  name: 'stats',
  title: 'Stats',
  component: EntriesStats,
  icon: Icon,
}
