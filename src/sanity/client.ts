import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set false to ensure immediate updates when editors publish changes in CMS
})

export { projectId, dataset, apiVersion }
