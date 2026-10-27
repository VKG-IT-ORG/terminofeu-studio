import { buildLegacyTheme, defineConfig } from 'sanity'
import { FlameIcon } from './static/FlameIcon.jsx'
import { structureTool } from 'sanity/structure'
import { deDELocale } from '@sanity/locale-de-de'
import { dashboardTool } from '@sanity/dashboard'
import { visionTool } from '@sanity/vision'
import { documentListWidget } from 'sanity-plugin-dashboard-widget-document-list'
import schemas from './schemas/schema'
import { structure, defaultDocumentNode } from './structure'
import { welcomeWidget } from './desktop-widgets/welcome-widget'

import EntriesStats from './tools/entries-stats/EntriesStats'
import Anhang2 from './tools/anhang-2/Anhang2.jsx'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const auth_endpoint = process.env.SANITY_STUDIO_AUTH_ENDPOINT || ''

const myTheme = buildLegacyTheme({
  '--main-navigation-color': '#c05621',
  '--brand-primary': '#dd6b20',
  '--brand-secondary': '#f6ad55',
})

export default defineConfig({
  title: 'Terminofeu',
  projectId,
  dataset,
  icon: FlameIcon,
  releases: {
    enabled: false,
  },
  scheduledPublishing: {
    enabled: false,
  },
  tasks: { enabled: false },
  plugins: [
    structureTool({
      structure,
      defaultDocumentNode,
      title: 'Einträge',
    }),
    dashboardTool({
      widgets: [
        welcomeWidget,
        documentListWidget({
          title: 'Zuletzt bearbeitete Einträge',
          order: '_updatedAt desc',
          limit: 20,
          types: ['entry'],
          showCreateButton: false,
          layout: { width: 'small' },
        }),
        documentListWidget({
          title: 'Zuletzt bearbeitete Quellen',
          order: '_updatedAt desc',
          limit: 20,
          types: ['source'],
          showCreateButton: false,
          layout: { width: 'small' },
        }),
      ],
    }),
    visionTool(),
    deDELocale(),
  ],
  tools: [EntriesStats, Anhang2],
  schema: {
    types: schemas,
  },
  document: {
    comments: {
      enabled: false,
    },
    productionUrl: async (prev, context) => {
      const { document } = context
      if (document._type === 'entry') {
        return `https://terminofeu.ch/de/entry/${document._id}`
      }
      return prev
    },
  },
  theme: myTheme,
  auth: {
    providers: (defaultProviders) => [
      {
        name: 'saml',
        title: 'VKG SAML Login',
        url: `https://api.sanity.io/v2021-10-01/auth/saml/login/${auth_endpoint}`,
        logo: 'https://www.vkg.ch/favicon/favicon-32x32.png',
      },
      ...defaultProviders,
    ],
  },
})
