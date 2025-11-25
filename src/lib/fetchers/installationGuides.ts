import { INSTALLATION_GUIDE_QUERY } from '@/lib/sanity/queries';
import { InstallationGuide } from '@/lib/sanity/schema-types';
import { shopifyStorefrontFetch } from '@/lib/shopify/storefront/client';
import { GET_PRODUCT_BY_HANDLE_QUERY } from '@/lib/shopify/storefront/queries';
import { ShopifyProduct, ShopifyProductFlattened } from '@/lib/types/shopify';
import { fetchSanityData } from '@/hooks/useServerSideSanityQuery';
import { INSTALLATION_GUIDES_QUERY } from '@/lib/sanity/queries';
import { flattenMedia } from '@/lib/helpers/flattenMedia';

interface FetchInstallationGuideOptions {
    locale: string;
    slug: string;
}

/**
 * Fetch page data from Sanity and resolve Shopify product modules
 * @param options - locale and slug for the page
 * @returns Promise resolving to the page with resolved Shopify data
 */
export async function fetchInstallationGuide(options: FetchInstallationGuideOptions): Promise<InstallationGuide | null> {
    const { locale, slug } = options;

    // Convert locale to Shopify LanguageCode format (e.g., 'en' -> 'EN', 'fr' -> 'FR')
    const shopifyLanguage = locale.toUpperCase();

    try {
        // Fetch page data from Sanity
        const guides = await fetchSanityData<InstallationGuide[]>(
            INSTALLATION_GUIDE_QUERY,
            { params: { language: locale, slug } }
        );

        const guide = guides?.[0];

        if (!guide || !guide.slug?.current) {
            return null;
        }

        const product = await fetchShopifyProduct(
            guide.slug.current,
            shopifyLanguage
        );


        if (!product) return guide;

        // Process modules to resolve Shopify data
        // const resolvedModules = await Promise.all(
        //   page.modules.map(async (module) => {
        //     const moduleWithShopify = module as ModuleWithShopify;

        //     // Check if this module needs Shopify data
        //     if (moduleWithShopify.shopifyFetchCollectionKey) {
        //       try {
        //         let products: ShopifyProductFlattened[] = [];

        //         // Use different queries based on the collection key type
        //         switch (moduleWithShopify.shopifyFetchCollectionKey) {
        //           case 'product':
        //           case 'products':
        //             // Fetch products from Shopify, sorted by published date (newest first)
        //             const productsData = await shopifyStorefrontFetch<ShopifyProductsResponse>({
        //               query: GET_PRODUCTS_QUERY,
        //               variables: {
        //                 first: 50,
        //                 query: '', // Fetch all products, or add specific query
        //                 language: shopifyLanguage, // Pass language as GraphQL variable
        //               },
        //             });

        //             // Flatten the products structure and remove edges/nodes
        //             // Add collection handle (page slug) to products for URL generation
        //             products = productsData.products.edges.map((edge) => {
        //               const product = edge.node;
        //               return {
        //                 ...product,
        //                 collectionHandle: 'products', // Use 'products' as collection handle for URL
        //                 // Flatten images - remove edges/nodes structure
        //                 images: product.images.edges.map((imgEdge) => imgEdge.node),
        //                 // Flatten variants - remove edges/nodes structure
        //                 variants: product.variants.edges.map((variantEdge) => variantEdge.node),
        //               };
        //             });
        //             break;

        //           // Add more cases for different collection types
        //           // case 'collection':
        //           //   // Fetch from a specific collection
        //           //   break;

        //           // case 'featured':
        //           //   // Fetch featured products
        //           //   break;

        //           default:
        //             console.warn(
        //               `Unknown shopifyFetchCollectionKey: "${moduleWithShopify.shopifyFetchCollectionKey}"`
        //             );
        //             products = [];
        //         }

        //         // Return module with resolved products
        //         return {
        //           ...moduleWithShopify,
        //           products,
        //         };
        //       } catch (shopifyError) {
        //         console.error(
        //           `Failed to fetch Shopify data for collection key "${moduleWithShopify.shopifyFetchCollectionKey}":`,
        //           shopifyError
        //         );
        //         // Return module without products on error
        //         return {
        //           ...moduleWithShopify,
        //           products: [],
        //         };
        //       }
        //     }

        //     // Return module as-is if no Shopify data needed
        //     return module;
        //   })
        // );

        // Return page with resolved modules
        return {
            ...guide,
        } as InstallationGuide;
    } catch (error) {
        console.error('Error fetching page:', error);
        throw error;
    }
}

/**
 * Fetch all installation guides from Sanity
 * @param locale - The language/locale for the guides (e.g., 'en', 'fr')
 * @returns Promise resolving to an array of installation guides
 */
export async function fetchAllInstallationGuides(locale: string): Promise<InstallationGuide[]> {
    try {
        // Fetch all installation guides from Sanity
        const guides = await fetchSanityData<InstallationGuide[]>(
            INSTALLATION_GUIDES_QUERY,
            { params: { language: locale } }
        );

        return guides || [];
    } catch (error) {
        console.error('Error fetching installation guides:', error);
        throw error;
    }
}   

interface ProductByHandleResponse {
    productByHandle: ShopifyProduct | null;
}

/**
 * Fetch a single product from Shopify by handle (server-side)
 * @param handle - The product handle (slug)
 * @param language - The language/locale for the product (e.g., 'en', 'fr')
 * @returns Promise resolving to the flattened product or null
 */
export async function fetchShopifyProduct(
    handle: string,
    language?: string
): Promise<ShopifyProductFlattened | null> {
    try {
        // Convert language to Shopify LanguageCode format if provided
        const shopifyLanguage = language ? language.toUpperCase() : undefined;

        const shopifyData = await shopifyStorefrontFetch<ProductByHandleResponse>({
            query: GET_PRODUCT_BY_HANDLE_QUERY,
            variables: {
                handle,
                language: shopifyLanguage, // Pass language as GraphQL variable
            },
        });

        if (!shopifyData.productByHandle) {
            return null;
        }

        const product = shopifyData.productByHandle;

        // Flatten the product structure
        return {
            ...product,
            collectionHandle: 'products', // Use 'products' as collection handle for URL
            media: flattenMedia(product.media.edges),
            variants: product.variants.edges.map((variantEdge) => variantEdge.node),
        };
    } catch (error) {
        console.error(`Failed to fetch Shopify product "${handle}":`, error);
        return null;
    }
}

