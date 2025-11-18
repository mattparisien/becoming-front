import { fetchSanityData } from "@/hooks/useServerSideSanityQuery";
import { getMarkets } from "../i18n/config";
import { GET_ALL_PAGE_SLUGS_QUERY } from "../sanity/queries";
import { shopifyStorefrontFetch } from "../shopify/storefront/client";
import { GET_PRODUCTS_QUERY } from "../shopify/storefront/queries";
import { ShopifyProductsResponse } from "../types/shopify";
import { toShopifyCountry, toShopifyLanguage } from "../mappers/toShopifyMarket";

interface PageParams {
    country: string;
    lang: string;
    slug: string[];
}

interface ProductParams {
    country: string;
    lang: string;
    slug: string;
}

/**
 * @summary Fetch all pages from Sanity and all products from Shopify for each country/locale combination
 * @description This function is used for generateStaticParams to pre-render all pages with their products
 * @returns Array of page parameters with country, lang, and slug
 */
export async function getAllPageParams(): Promise<PageParams[]> {
    try {
        // Get all markets (country/locale combinations)
        const markets = await getMarkets();

        if (!markets || markets.length === 0) {
            return [];
        }

        // Fetch all page slugs from Sanity (with their language)
        const pages = await fetchSanityData<Array<{ slug: string, language: string }>>(GET_ALL_PAGE_SLUGS_QUERY);

        if (!pages || pages.length === 0) {
            return [];
        }

        // Generate params only for pages that match the locale
        const pageParams: PageParams[] = [];

        for (const market of markets) {
            for (const locale of market.locales) {
                for (const page of pages) {
                    // Only add page if it's available in this locale
                    if (page.language === locale) {
                        pageParams.push({
                            country: market.country.code,
                            lang: locale,
                            slug: [page.slug],
                        });
                    }
                }
            }
        }

        return pageParams;
    } catch (error) {
        console.error('Error fetching all pages:', error);
        return [];
    }
}

/**
 * @summary Fetch all product handles from Shopify for each country/locale combination
 * @description This function is used for generateStaticParams to pre-render all product pages
 * @returns Array of product parameters with country, lang, and slug (product handle)
 */
export async function getAllProductParams(): Promise<ProductParams[]> {
    try {
        // Get all markets (country/locale combinations)
        const markets = await getMarkets();

        if (!markets || markets.length === 0) {
            return [];
        }

        const productParams: ProductParams[] = [];

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
                            slug: edge.node.handle,
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
