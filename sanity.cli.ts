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
  typegen: {
    path: '../terminofeu-web-astro/src/ts/sanity.ts', // glob pattern to your typescript files. Can also be an array of paths
    schema: 'schema.json', // path to your schema file, generated with 'sanity schema extract' command
    generates: '../terminofeu-web-astro/src/types/sanity.types.ts', // path to the output file for generated type definitions
    overloadClientMethods: true, // set to false to disable automatic overloading the sanity client
  },
})
