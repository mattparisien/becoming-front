const apiVersion = '2024-10'; // Shopify Admin API version

interface AdminAPIRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
}

export async function shopifyAdminRequest<T = unknown>({
  query,
  variables = {},
}: AdminAPIRequestOptions): Promise<T> {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!shopifyDomain) {
    throw new Error('SHOPIFY_STORE_DOMAIN is not defined in environment variables');
  }

  if (!adminAccessToken) {
    throw new Error('SHOPIFY_ADMIN_ACCESS_TOKEN is not defined in environment variables');
  }

  const endpoint = `https://${shopifyDomain}/admin/api/${apiVersion}/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': adminAccessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify Admin API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`Shopify Admin API GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}
