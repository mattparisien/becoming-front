'use client';

import { useState, useEffect, useCallback } from 'react';
import { shopifyStorefrontFetch, isShopifyConfigured } from '@/lib/shopify/storefront/client';
import { GET_PRODUCT_BY_HANDLE_QUERY } from '@/lib/shopify/storefront/queries';
import { ShopifyProduct } from '@/lib/types/shopify';

interface UseShopifyProductResult {
  product: ShopifyProduct | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface ProductByHandleResponse {
  productByHandle: ShopifyProduct | null;
}

/**
 * Custom hook for fetching a single product from Shopify Storefront API by handle
 * @param handle - The product handle (slug)
 * @param language - Optional language/locale for the product (e.g., 'en', 'fr')
 * @returns Object containing product, loading state, error, and refetch function
 * 
 * @example
 * const { product, isLoading, error } = useShopifyProduct('shuffled-text-link', 'en')
 */
export function useShopifyProduct(handle: string, language?: string): UseShopifyProductResult {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!handle) {
      setIsLoading(false);
      return;
    }

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

      const result = await shopifyStorefrontFetch<ProductByHandleResponse>({
        query: GET_PRODUCT_BY_HANDLE_QUERY,
        variables: {
          handle,
          language: shopifyLanguage, // Pass language as GraphQL variable
        },
      });

      setProduct(result.productByHandle);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      console.error('Error fetching Shopify product:', err);
    } finally {
      setIsLoading(false);
    }
  }, [handle, language]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct,
  };
}
