import { fetchSanityData } from './useServerSideSanityQuery';
import { EXCLUDED_SLUGS_QUERY, PAGE_QUERY } from '@/lib/sanity/queries';
import { SanityPage, SanityModule } from '@/lib/types/sanity';
import { shopifyStorefrontFetch } from '@/lib/shopify/storefront/client';
import { shopifyAdminRequest } from '@/lib/shopify/admin';
import { GET_PRODUCTS_QUERY, GET_PRODUCT_BY_HANDLE_QUERY, GET_COLLECTION_BY_HANDLE_QUERY } from '@/lib/shopify/storefront/queries';
import { GET_PRODUCTS_ADMIN_QUERY, GET_PRODUCT_BY_HANDLE_ADMIN_QUERY } from '@/lib/shopify/admin/queries';
import { ShopifyProduct, ShopifyProductFlattened, ShopifyProductsResponse } from '@/lib/types/shopify';
import { unstable_cache } from "next/cache";
import { flattenMedia } from '@/lib/helpers/flattenMedia';

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
async function _fetchPage(options: FetchPageOptions): Promise<SanityPage | null> {
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
                // In development, use Admin API to fetch drafts; in production use Storefront API
                if (process.env.NODE_ENV === 'development') {
                  const adminData = await shopifyAdminRequest<{ products: ShopifyProductsResponse['products'] }>({
                    query: GET_PRODUCTS_ADMIN_QUERY,
                    variables: {
                      first: 20,
                      query: '',
                    },
                  });


                  // Transform Admin API response to match Storefront API structure
                  products = adminData.products.edges.map((edge) => {
                    const product = edge.node as any;
                    return {
                      ...product,
                      collectionHandle: 'products',
                      media: flattenMedia(product.media.edges),
                      variants: product.variants.edges.map((variantEdge: any) => ({
                        ...variantEdge.node,
                        priceV2: {
                          amount: variantEdge.node.price,
                          currencyCode: product.priceRangeV2?.maxVariantPrice?.currencyCode || 'USD',
                        },
                      })),
                      priceRange: {
                        minVariantPrice: product.priceRangeV2?.minVariantPrice || { amount: '0', currencyCode: 'USD' },
                        maxVariantPrice: product.priceRangeV2?.maxVariantPrice || { amount: '0', currencyCode: 'USD' },
                      },
                    };
                  });
                  console.log('Admin API productsss', products);
                } else {
                  // Production: use Storefront API (published products only)
                  const productsData = await shopifyStorefrontFetch<ShopifyProductsResponse>({
                    query: GET_PRODUCTS_QUERY,
                    variables: {
                      first: 20,
                      query: '',
                      language: shopifyLanguage,
                      country: shopifyCountry,
                    },
                  });

                  products = productsData.products.edges.map((edge) => {
                    const product = edge.node;
                    
                    return {
                      ...product,
                      collectionHandle: 'products',
                      media: flattenMedia(product.media.edges),
                      variants: product.variants.edges.map((variantEdge) => variantEdge.node),
                    };
                  });
                }
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

export const fetchPage = unstable_cache(
  _fetchPage,
  ['page-data'],
  { 
    revalidate: process.env.NODE_ENV === 'development' ? false : 3600, 
    tags: ['page'] 
  }
);

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

export const fetchExcludedSlugs = unstable_cache(
  _fetchExcludedPageSlugs,
  ['excluded-slugs'],
  { revalidate: 3600, tags: ['page-slugs'] }
);


/**
 * Fetch products from Shopify by collection key
 * @param collectionKey - The product type or collection identifier
 * @param limit - Maximum number of products to fetch
 * @param language - The language/locale for the products (e.g., 'en', 'fr')
 * @returns Promise resolving to array of flattened products
 */
async function _fetchShopifyCollection(
  collectionKey: string,
  limit: number = 50,
  language?: string
): Promise<ShopifyProductFlattened[]> {
  try {
    // Convert language to Shopify LanguageCode format if provided
    const shopifyLanguage = language ? language.toUpperCase() : undefined;
console.log(collectionKey)
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
        collectionHandle: 'products',
        media: flattenMedia(product.media.edges),
        variants: product.variants.edges.map((variantEdge) => variantEdge.node),
      };
    });
  } catch (error) {
    console.error(`Failed to fetch Shopify collection "${collectionKey}":`, error);
    return [];
  }
}

export const fetchShopifyCollection = unstable_cache(
  _fetchShopifyCollection,
  ['shopify-collection'],
  { revalidate: 3600, tags: ['products'] }
);

interface ProductByHandleResponse {
  productByHandle: ShopifyProduct | null;
}

/**
 * Fetch a single product from Shopify by handle (server-side)
 * @param handle - The product handle (slug)
 * @param language - The language/locale for the product (e.g., 'en', 'fr')
 * @returns Promise resolving to the flattened product or null
 */
async function _fetchShopifyProduct(
  handle: string,
  language: string,
  country: string
): Promise<ShopifyProductFlattened | null> {
  try {
    console.log(`[fetchShopifyProduct] Fetching product: ${handle}, env: ${process.env.NODE_ENV}`);
    
    // In development, use Admin API to fetch drafts
    if (process.env.NODE_ENV === 'development') {
      const adminData = await shopifyAdminRequest<{
        productByHandle: {
          id: string;
          title: string;
          handle: string;
          description: string;
          descriptionHtml: string;
          productType: string;
          tags: string[];
          vendor: string;
          status: string;
          priceRangeV2: {
            minVariantPrice: { amount: string; currencyCode: string };
            maxVariantPrice: { amount: string; currencyCode: string };
          };
          seo: { title: string; description: string };
          media: {
            edges: Array<{
              node: {
                image?: { url: string; altText: string };
                sources?: Array<{ url: string; mimeType: string }>;
                mediaContentType: string;
              };
            }>;
          };
          variants: {
            edges: Array<{
              node: {
                id: string;
                title: string;
                price: string;
                availableForSale: boolean;
              };
            }>;
          };
        } | null;
      }>({
        query: GET_PRODUCT_BY_HANDLE_ADMIN_QUERY,
        variables: { handle },
      });

      console.log(`[fetchShopifyProduct] Admin API response:`, adminData?.productByHandle ? 'Found' : 'Not found');

      if (!adminData.productByHandle) {
        return null;
      }

      const product = adminData.productByHandle;

      // Transform Admin API response to match Storefront API structure
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        description: product.description,
        descriptionHtml: product.descriptionHtml,
        productType: product.productType,
        tags: product.tags,
        vendor: product.vendor,
        seo: product.seo,
        collectionHandle: 'products',
        // Transform priceRangeV2 to priceRange for consistency
        priceRange: {
          minVariantPrice: {
            amount: product.priceRangeV2.minVariantPrice.amount,
            currencyCode: product.priceRangeV2.minVariantPrice.currencyCode,
          },
          maxVariantPrice: {
            amount: product.priceRangeV2.maxVariantPrice.amount,
            currencyCode: product.priceRangeV2.maxVariantPrice.currencyCode,
          },
        },
        media: flattenMedia(product.media.edges),
        variants: product.variants.edges.map((variantEdge) => ({
          ...variantEdge.node,
          // Transform price to priceV2 for consistency
          priceV2: {
            amount: variantEdge.node.price,
            currencyCode: product.priceRangeV2.maxVariantPrice.currencyCode,
          },
        })),
      };
    }

    // Production: Use Storefront API
    const shopifyLanguage = language.toUpperCase();
    const shopifyCountry = country.toUpperCase();

    const shopifyData = await shopifyStorefrontFetch<ProductByHandleResponse>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: {
        handle,
        language: shopifyLanguage,
        country: shopifyCountry,
      },
    });

    console.log(`[fetchShopifyProduct] Storefront API response:`, shopifyData?.productByHandle ? 'Found' : 'Not found');

    if (!shopifyData.productByHandle) {
      return null;
    }

    const product = shopifyData.productByHandle;

    // Flatten the product structure
    return {
      ...product,
      collectionHandle: 'products',
      media: flattenMedia(product.media.edges),
      variants: product.variants.edges.map((variantEdge) => variantEdge.node),
    };
  } catch (error) {
    console.error(`[fetchShopifyProduct] Failed to fetch Shopify product "${handle}":`, error);
    return null;
  }
}

export const fetchShopifyProduct = unstable_cache(
  _fetchShopifyProduct,
  ['shopify-product'],
  { revalidate: process.env.NODE_ENV === 'development' ? false : 3600, tags: ['product'] }
);

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
async function _fetchShopifyCollectionByHandle(
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
        collectionHandle: 'products',
        media: flattenMedia(product.media.edges),
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

export const fetchShopifyCollectionByHandle = unstable_cache(
  _fetchShopifyCollectionByHandle,
  ['shopify-collection-by-handle'],
  { revalidate: 3600, tags: ['collection', 'products'] }
);

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