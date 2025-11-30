
export interface ShopifyProductsResponse {
    products: {
        edges: Array<{
            node: ShopifyProduct;
        }>;
    };
}
// Shopify Storefront API Types

export interface ShopifyImage {
    url: string;
    altText?: string;
}


export interface ShopifyMedia {
    mediaType: string;
    mediaContentType?: string;
    image?: ShopifyImage;
    sources?: Array<{
        url: string;
        mimeType: string;
    }>;
}

export interface ShopifySEO {
    title?: string;
    description?: string;
}

export interface ShopifyPriceRange {
    minVariantPrice: {
        amount: string;
        currencyCode: string;
    };
    maxVariantPrice: {
        amount: string;
        currencyCode: string;
    };
}

export interface ShopifyVariant {
    id: string;
    title: string;
    priceV2: {
        amount: string;
        currencyCode: string;
    };
    availableForSale: boolean;
}

export interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    descriptionHtml: string;
    productType: string;
    tags: string[];
    vendor: string;
    seo: ShopifySEO;
    media: {
        edges: Array<{
            node: ShopifyMedia;
        }>;
    };
    priceRange: ShopifyPriceRange;
    variants: {
        edges: Array<{
            node: ShopifyVariant;
        }>;
    };
}

// Flattened version without GraphQL edges/nodes structure
export interface ShopifyProductFlattened {
    id: string;
    title: string;
    handle: string;
    description: string;
    descriptionHtml: string;
    productType: string;
    tags: string[];
    vendor: string;
    seo: ShopifySEO;
    media: {
        src: string;
        mediaType: string;
        mimeType?: string;
        mediaContentType?: string;
    },
    priceRange: ShopifyPriceRange;
    variants: ShopifyVariant[];
    collectionHandle?: string; // Optional collection handle for URL construction
}


export interface ShopifyMarketNode {
    name: string;
    handle: string;
    webPresence: {
        rootUrls: Array<{
            locale: string;
            url: string;
        }>;
    }
    currencySettings: {
        baseCurrency: {
            currencyCode: string;
        };
    }
};

export interface ShopifyMarkets {
    nodes: ShopifyMarketNode[]
}
