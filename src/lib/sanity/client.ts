// ./src/sanity/lib/client.ts
import { createClient } from '@sanity/client'

import { apiVersion, dataset, projectId } from './env'

// Only validate server-side (this module should only be imported server-side)
if (typeof window === 'undefined' && (!projectId || !dataset)) {
    throw new Error('Missing SANITY_PROJECT_ID or SANITY_DATASET environment variables. Make sure they are set in .env.local')
}

export const client = createClient({
    projectId: projectId || '',
    dataset: dataset || '',
    apiVersion, 
    useCdn: process.env.NODE_ENV === 'production',
    perspective: 'drafts',
})