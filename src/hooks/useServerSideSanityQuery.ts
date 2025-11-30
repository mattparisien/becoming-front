import { client } from '@/lib/sanity/client'

interface ServerSideQueryOptions {
  params?: Record<string, unknown>
}

/**
 * Server-side function for fetching data from Sanity in Server Components
 * @param query - GROQ query string
 * @param options - Query parameters
 * @returns Promise resolving to the query result
 * 
 * @example
 * const products = await fetchSanityData<Product[]>(PRODUCTS_QUERY)
 * 
 * @example
 * const product = await fetchSanityData<Product>(
 *   PRODUCT_QUERY, 
 *   { params: { slug: 'product-slug' } }
 * )
 */
export async function fetchSanityData<T = unknown>(
  query: string,
  options: ServerSideQueryOptions = {}
): Promise<T> {
  const { params = {} } = options

  try {
    const result = await client.fetch<T>(query, params, {
      // Enable caching for server components
      // Disable cache in development to always get fresh drafts
      next: { revalidate: process.env.NODE_ENV === 'development' ? 0 : 60 },
    })
    return result
  } catch (error) {
    console.error('Error fetching from Sanity (server-side):', error)
    throw error
  }
}
