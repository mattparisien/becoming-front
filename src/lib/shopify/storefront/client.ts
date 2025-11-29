// Shopify Storefront API Client

interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
}

interface ShopifyResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
  }>;
}

/**
 * Fetch data from Shopify Storefront API
 * @param options - GraphQL query and variables
 * @returns Promise resolving to the response data
 */
export async function shopifyStorefrontFetch<T>(
  options: ShopifyFetchOptions
): Promise<T> {

  const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
  const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const API_VERSION = '2024-10';
const SHOPIFY_API_ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;


  const { query, variables } = options;



  if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN || !SHOPIFY_STORE_DOMAIN) {
    throw new Error('Shopify Storefront API credentials not configured. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in your environment variables.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  };

  const response = await fetch(SHOPIFY_API_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables: variables || {},
    }),
    cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'default',
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const result: ShopifyResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    const errorMessage = result.errors[0]?.message || 'GraphQL error';
    console.error('Shopify GraphQL errors:', result.errors);
    throw new Error(errorMessage);
  }

  return result.data;
}

/**
 * Check if Shopify credentials are configured
 */
export function isShopifyConfigured(): boolean {
  const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
  const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  return !!(SHOPIFY_STOREFRONT_ACCESS_TOKEN && SHOPIFY_STORE_DOMAIN);
}
