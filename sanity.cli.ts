import { defineCliConfig } from 'sanity/cli'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const appId = process.env.SANITY_STUDIO_APP_ID || ''

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: { autoUpdates: true, appId },
})
