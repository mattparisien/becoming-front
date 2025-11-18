"use server"
import { fetchSanityData } from "@/hooks/useServerSideSanityQuery";
import { GLOBAL_DATA_QUERY } from "../sanity/queries";
import { shopifyAdminRequest } from "../shopify/admin";
import { GET_MARKETS_QUERY } from "../shopify/admin/queries";
import { ShopifyMarkets } from "../types/shopify";


// Fetch global data with locale parameter
export const getGlobalData = async (locale: string) => {

    // Fetch global data from Sanity
    const sanityData = await fetchSanityData<{ 
        seo: { 
            title: string; 
            description?: string; 
            image?: { url: string; alt?: string } 
        }; 
        theme?: unknown 
    }>(
        GLOBAL_DATA_QUERY,
        { params: { locale } }
    );

    // Fetch shopify market data
    const shopifyData = await shopifyAdminRequest<{ markets: ShopifyMarkets }>(
        {
            query: GET_MARKETS_QUERY
        }
    );


    const globalData = {
        ...sanityData,
        markets: shopifyData.markets.nodes.map((market) => ({
            country: {
                name: market.name,
                code: market.handle
            },
            currencyCode: market.currencySettings.baseCurrency.currencyCode,
            locales: market.webPresence.rootUrls.map(rootUrl => rootUrl.locale)
        }))
    };


    return globalData;
}