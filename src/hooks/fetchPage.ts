import { fetchSanityData } from './useServerSideSanityQuery';
import { EXCLUDED_SLUGS_QUERY, PAGE_QUERY } from '@/lib/sanity/queries';
import { SanityPage, SanityModule } from '@/lib/types/sanity';
import { shopifyStorefrontFetch } from '@/lib/shopify/storefront/client';
import { GET_PRODUCTS_QUERY, GET_PRODUCT_BY_HANDLE_QUERY, GET_COLLECTION_BY_HANDLE_QUERY } from '@/lib/shopify/storefront/queries';
import { ShopifyProduct, ShopifyProductFlattened, ShopifyProductsResponse } from '@/lib/types/shopify';
import { cache } from "react";

interface FetchPageOptions {
  country: string;
  lang: string;
  slug: string;
}

interface ModuleWithShopify extends SanityModule {
  shopifyFetchCollectionKey?: string;
  products?: ShopifyProductFlattened[];
}

/**
 * Fetch page data from Sanity and resolve Shopify product modules
 * @param options - locale and slug for the page
 * @returns Promise resolving to the page with resolved Shopify data
 */
export async function fetchPage(options: FetchPageOptions): Promise<SanityPage | null> {
  const { lang, country, slug } = options;


  if (!country || !lang || !slug) return null;

  // Convert lang to Shopify LanguageCode format (e.g., 'en' -> 'EN', 'fr' -> 'FR')
  const shopifyLanguage = lang.toUpperCase();
  const shopifyCountry = country.toUpperCase();


  try {
    // Fetch page data from Sanity
    const pages = await fetchSanityData<SanityPage[]>(
      PAGE_QUERY,
      { params: { locale: lang, slug } }
    );

    if (!pages || pages.length === 0) {
      return null;
    }

    const page = pages[0];


    if (!page.modules || page.modules.length === 0) {
      return page;
    }

    // Process modules to resolve Shopify data
    const resolvedModules = await Promise.all(
      page.modules.map(async (module) => {
        const moduleWithShopify = module as ModuleWithShopify;

        // Check if this module needs Shopify data
        if (moduleWithShopify.shopifyFetchCollectionKey) {
          try {
            let products: ShopifyProductFlattened[] = [];

            // Use different queries based on the collection key type
            switch (moduleWithShopify.shopifyFetchCollectionKey) {
              case 'product':
              case 'products':
                // Fetch products from Shopify, sorted by published date (newest first)
                const productsData = await shopifyStorefrontFetch<ShopifyProductsResponse>({
                  query: GET_PRODUCTS_QUERY,
                  variables: {
                    first: 50,
                    query: '', // Fetch all products, or add specific query
                    language: shopifyLanguage, // Pass language as GraphQL variable
                    country: shopifyCountry,
                  },
                });

                // Flatten the products structure and remove edges/nodes
                // Add collection handle (page slug) to products for URL generation
                products = productsData.products.edges.map((edge) => {
                  const product = edge.node;
                  return {
                    ...product,
                    collectionHandle: 'products', // Use 'products' as collection handle for URL
                    // Flatten images - remove edges/nodes structure
                    images: product.images.edges.map((imgEdge) => imgEdge.node),
                    // Flatten variants - remove edges/nodes structure
                    variants: product.variants.edges.map((variantEdge) => variantEdge.node),
                  };
                });
                break;

              // Add more cases for different collection types
              // case 'collection':
              //   // Fetch from a specific collection
              //   break;

              // case 'featured':
              //   // Fetch featured products
              //   break;

              default:
                console.warn(
                  `Unknown shopifyFetchCollectionKey: "${moduleWithShopify.shopifyFetchCollectionKey}"`
                );
                products = [];
            }

            // Return module with resolved products
            return {
              ...moduleWithShopify,
              products,
            };
          } catch (shopifyError) {
            console.error(
              `Failed to fetch Shopify data for collection key "${moduleWithShopify.shopifyFetchCollectionKey}":`,
              shopifyError
            );
            // Return module without products on error
            return {
              ...moduleWithShopify,
              products: [],
            };
          }
        }

        // Return module as-is if no Shopify data needed
        return module;
      })
    );

    // Return page with resolved modules
    return {
      ...page,
      modules: resolvedModules,
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    throw error;
  }
}

async function _fetchExcludedPageSlugs(): Promise<string[]> {
  try {
    const excludedPages = await fetchSanityData<{ slug: string }[]>(
      EXCLUDED_SLUGS_QUERY
    );

    return excludedPages.map(page => page.slug);
  } catch (error) {
    console.error('Error fetching excluded page slugs:', error);
    return [];
  }
};

export const fetchExcludedSlugs = cache(_fetchExcludedPageSlugs);


/**
 * Fetch products from Shopify by collection key
 * @param collectionKey - The product type or collection identifier
 * @param limit - Maximum number of products to fetch
 * @param language - The language/locale for the products (e.g., 'en', 'fr')
 * @returns Promise resolving to array of flattened products
 */
export async function fetchShopifyCollection(
  collectionKey: string,
  limit: number = 50,
  language?: string
): Promise<ShopifyProductFlattened[]> {
  try {
    // Convert language to Shopify LanguageCode format if provided
    const shopifyLanguage = language ? language.toUpperCase() : undefined;

    const shopifyData = await shopifyStorefrontFetch<ShopifyProductsResponse>({
      query: GET_PRODUCTS_QUERY,
      variables: {
        first: limit,
        query: `product_type:${collectionKey}`,
        language: shopifyLanguage, // Pass language as GraphQL variable
      },
    });

    // Flatten the products structure
    return shopifyData.products.edges.map((edge) => {
      const product = edge.node;
      return {
        ...product,
        collectionHandle: 'products', // Use 'products' as collection handle for URL
        images: product.images.edges.map((imgEdge) => imgEdge.node),
        variants: product.variants.edges.map((variantEdge) => variantEdge.node),
      };
    });
  } catch (error) {
    console.error(`Failed to fetch Shopify collection "${collectionKey}":`, error);
    return [];
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
  language: string,
  country: string
): Promise<ShopifyProductFlattened | null> {
  try {
    // Convert language to Shopify LanguageCode format if provided
    const shopifyLanguage = language.toUpperCase();
    const shopifyCountry = country.toUpperCase();

    const shopifyData = await shopifyStorefrontFetch<ProductByHandleResponse>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: {
        handle,
        language: shopifyLanguage, // Pass language as GraphQL variable
        country: shopifyCountry,
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
      images: product.images.edges.map((imgEdge) => imgEdge.node),
      variants: product.variants.edges.map((variantEdge) => variantEdge.node),
    };
  } catch (error) {
    console.error(`Failed to fetch Shopify product "${handle}":`, error);
    return null;
  }
}

interface CollectionByHandleResponse {
  collection: {
    id: string;
    title: string;
    handle: string;
    description: string;
    descriptionHtml: string;
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  } | null;
}

/**
 * Fetch products from a specific Shopify collection by handle (server-side)
 * @param collectionHandle - The collection handle (slug)
 * @param language - The language/locale for the products (e.g., 'en', 'fr')
 * @param limit - Maximum number of products to fetch
 * @returns Promise resolving to collection info and flattened products
 */
export async function fetchShopifyCollectionByHandle(
  collectionHandle: string,
  language?: string,
  limit: number = 50
): Promise<{ collection: { id: string; title: string; handle: string; description: string; descriptionHtml: string }; products: ShopifyProductFlattened[] } | null> {
  try {
    // Convert language to Shopify LanguageCode format if provided
    const shopifyLanguage = language ? language.toUpperCase() : undefined;

    const shopifyData = await shopifyStorefrontFetch<CollectionByHandleResponse>({
      query: GET_COLLECTION_BY_HANDLE_QUERY,
      variables: {
        handle: collectionHandle,
        first: limit,
        language: shopifyLanguage, // Pass language as GraphQL variable
      },
    });

    if (!shopifyData.collection) {
      return null;
    }

    const collection = shopifyData.collection;

    // Flatten the products structure and add collection handle for URL construction
    const products = collection.products.edges.map((edge) => {
      const product = edge.node;
      return {
        ...product,
        // Add 'products' as collection handle for URL generation
        collectionHandle: 'products',
        images: product.images.edges.map((imgEdge) => imgEdge.node),
        variants: product.variants.edges.map((variantEdge) => variantEdge.node),
      };
    }) as ShopifyProductFlattened[];

    return {
      collection: {
        id: collection.id,
        title: collection.title,
        handle: collection.handle,
        description: collection.description,
        descriptionHtml: collection.descriptionHtml,
      },
      products,
    };
  } catch (error) {
    console.error(`Failed to fetch Shopify collection "${collectionHandle}":`, error);
    return null;
  }
}

/**
 * Fetch a single product from a specific Shopify collection by handles (server-side)
 * @param collectionHandle - The collection handle (slug)
 * @param productHandle - The product handle (slug)
 * @param language - The language/locale for the product (e.g., 'en', 'fr')
 * @returns Promise resolving to the flattened product or null if not found in collection
 */
export async function fetchProductFromCollection(
  collectionHandle: string,
  productHandle: string,
  language?: string
): Promise<ShopifyProductFlattened | null> {
  try {
    const collectionData = await fetchShopifyCollectionByHandle(collectionHandle, language, 100);


    if (!collectionData) {
      console.error(`Collection "${collectionHandle}" not found`);
      return null;
    }

    // Find the product in the collection by handle
    const product = collectionData.products.find(p => p.handle === productHandle);

    if (!product) {
      console.error(`Product "${productHandle}" not found in collection "${collectionHandle}"`);
      return null;
    }

    return product;
  } catch (error) {
    console.error(`Failed to fetch product "${productHandle}" from collection "${collectionHandle}":`, error);
    return null;
  }
}