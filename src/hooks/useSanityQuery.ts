import { useState, useEffect, useCallback, useMemo } from 'react'
import { client } from '@/lib/sanity/client'

interface UseSanityQueryOptions {
  params?: Record<string, unknown>
  enabled?: boolean // Allow conditional fetching
}

interface UseSanityQueryResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Custom hook for fetching data from Sanity on the client side
 * @param query - GROQ query string
 * @param options - Query parameters and options
 * @returns Object containing data, loading state, error, and refetch function
 * 
 * @example
 * const { data, isLoading, error } = useSanityQuery<Product[]>(PRODUCTS_QUERY)
 * 
 * @example
 * const { data, isLoading, error } = useSanityQuery<Product>(
 *   PRODUCT_QUERY, 
 *   { params: { slug: 'product-slug' } }
 * )
 */
export function useSanityQuery<T = unknown>(
  query: string,
  options: UseSanityQueryOptions = {}
): UseSanityQueryResult<T> {
  const { params = {}, enabled = true } = options
  
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  // Memoize params string to avoid unnecessary re-fetches
  const paramsString = useMemo(() => JSON.stringify(params), [params])

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const parsedParams = JSON.parse(paramsString)
      const result = await client.fetch<T>(query, parsedParams)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'))
      console.error('Error fetching from Sanity:', err)
    } finally {
      setIsLoading(false)
    }
  }, [query, paramsString, enabled])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}
