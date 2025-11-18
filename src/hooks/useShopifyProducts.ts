'use client';

import { useState, useEffect, useCallback } from 'react';
import { shopifyStorefrontFetch, isShopifyConfigured } from '@/lib/shopify/storefront/client';
import { GET_PRODUCTS_QUERY } from '@/lib/shopify/storefront/queries';
import { ShopifyProduct } from '@/lib/types/shopify';

interface UseShopifyProductsOptions {
  first?: number;
  query?: string;
  language?: string;
}

interface UseShopifyProductsResult {
  products: ShopifyProduct[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface ProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

/**
 * Custom hook for fetching products from Shopify Storefront API
 * @param options - Query options (first: number of products, query: search query, language: locale)
 * @returns Object containing products, loading state, error, and refetch function
 * 
 * @example
 * const { products, isLoading, error } = useShopifyProducts({ first: 10, language: 'en' })
 */
export function useShopifyProducts(
  options: UseShopifyProductsOptions = {}
): UseShopifyProductsResult {
  const { first = 10, query = '', language } = options;
  
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!isShopifyConfigured()) {
      setError(new Error('Shopify credentials not configured'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Convert language to Shopify LanguageCode format if provided
      const shopifyLanguage = language ? language.toUpperCase() : undefined;

      const result = await shopifyStorefrontFetch<ProductsResponse>({
        query: GET_PRODUCTS_QUERY,
        variables: {
          first,
          query: query || null,
          language: shopifyLanguage, // Pass language as GraphQL variable
        },
      });

      const fetchedProducts = result.products.edges.map(edge => edge.node);
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      console.error('Error fetching Shopify products:', err);
    } finally {
      setIsLoading(false);
    }
  }, [first, query, language]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}
