import { shopifyStorefrontFetch } from '@/lib/shopify/storefront/client';
import { GET_PRODUCTS_QUERY } from '@/lib/shopify/storefront/queries';
import { ShopifyProductsResponse } from '@/lib/types/shopify';
import { getMarkets } from '../i18n/config';
import { toShopifyCountry, toShopifyLanguage } from '../mappers/toShopifyMarket';

interface PageParams {
  country: string;
  lang: string;
  slug: string[];
}

/**
 * @summary Fetch all product handles from Shopify for each country/locale combination
 * @description This function is used for generateStaticParams to pre-render all product pages
 * @returns Array of product parameters with country, lang, and slug (product handle)
 */
export async function getAllProducts(): Promise<PageParams[]> {
  try {
    // Get all markets (country/locale combinations)
    const markets = await getMarkets();

    if (!markets || markets.length === 0) {
      return [];
    }

    const productParams: PageParams[] = [];

    // Fetch products for each country/locale combination
    for (const market of markets) {
      const shopifyCountry = toShopifyCountry(market.country.code);

      for (const locale of market.locales) {
        const shopifyLanguage = toShopifyLanguage(locale);

        try {
          // Fetch products from Shopify for this market
          const productsData = await shopifyStorefrontFetch<ShopifyProductsResponse>({
            query: GET_PRODUCTS_QUERY,
            variables: {
              first: 250, // Fetch up to 250 products (adjust as needed)
              query: '',
              language: shopifyLanguage,
              country: shopifyCountry,
            },
          });

          // Extract product handles and create params
          productsData.products.edges.forEach((edge) => {
            productParams.push({
              country: market.country.code,
              lang: locale,
              slug: [edge.node.handle],
            });
          });
        } catch (shopifyError) {
          console.error(
            `Failed to fetch products for ${market.country.code}/${locale}:`,
            shopifyError
          );
          // Continue with other markets even if one fails
        }
      }
    }

    return productParams;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}
