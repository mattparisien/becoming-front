import { fetchSanityData } from "@/hooks/useServerSideSanityQuery";
import { PRODUCT_QUERY } from "../sanity/queries";
import { fetchShopifyProduct } from "@/hooks/fetchPage";
import { ShopifyProductFlattened } from "../types/shopify";
import { PortableTextBlock } from "@portabletext/types";
import{ client }from "@/lib/sanity/client";


interface ProductParams {
    lang: string;
    slug: string;
    country: string;
}

interface SanityProductData {
    additionalInfo?: {
        content: PortableTextBlock[];
    };
}

interface ProductWithAdditionalInfo extends ShopifyProductFlattened {
    additionalInfo?: {
        content: PortableTextBlock[];
    };
}

/**
 * @summary Fetch all product handles from Shopify for each country/locale combination
 * @description This function is used for generateStaticParams to pre-render all product pages
 * @returns Array of product parameters with country, lang, and slug (product handle)
 */
export async function getProduct(params: ProductParams): Promise<ProductWithAdditionalInfo | null> {
    try {
        // Get sanity product

        const { slug, country, lang } = params;

        if (!slug || !lang || !country) {
            console.log('[getProduct] Missing required params');
            return null;
        }

        const sanityProduct = await fetchSanityData<SanityProductData>(PRODUCT_QUERY, {
            params: {
                slug: slug,
                language: lang,
                env: process.env.NODE_ENV || 'development',
            }
        });

console.log('cleint', client);
        
        console.log('[getProduct] Sanity product:', sanityProduct ? 'Found' : 'Not found');

        if (!sanityProduct) {
            console.log('[getProduct] No Sanity product found, returning null');
            return null;
        }

        const shopifyProduct = await fetchShopifyProduct(slug, lang, country);

        console.log('[getProduct] Shopify product:', shopifyProduct ? 'Found' : 'Not found');

        if (!shopifyProduct) {
            console.log('[getProduct] No Shopify product found, returning null');
            return null;
        }

        return {
            
            additionalInfo: sanityProduct.additionalInfo,
            ...shopifyProduct
        };

    } catch (error) {
        console.error('[getProduct] Error fetching product', error);
        return null;
    }
}
