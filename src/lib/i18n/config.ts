import { shopifyAdminRequest } from "@/lib/shopify/admin";
import { GET_MARKETS_QUERY } from "@/lib/shopify/admin/queries";
import { ShopifyMarketNode, ShopifyMarkets } from "@/lib/types/shopify";
import { cache } from "react";
import { DEFAULT_COUNTRY, DEFAULT_LOCALE } from "../constants";
import { Location } from "../types/misc";

// Module-level cache for markets data
let cachedMarkets: Location[] | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Internal function to fetch markets with persistent caching
async function _fetchMarkets(): Promise<Location[]> {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedMarkets && (now - lastFetchTime) < CACHE_TTL) {
        return cachedMarkets;
    }

    try {
        const data = await shopifyAdminRequest<{ markets: ShopifyMarkets }>({
            query: GET_MARKETS_QUERY,
        });

        const markets: Location[] = data.markets.nodes.map((market: ShopifyMarketNode) => ({
            country: {
                name: market.name,
                code: market.handle
            },
            currencyCode: market.currencySettings.baseCurrency.currencyCode,
            locales: market.webPresence.rootUrls.map(rootUrl => rootUrl.locale)
        }));

        // Update cache
        cachedMarkets = markets;
        lastFetchTime = now;

        return markets;
    } catch (error) {
        console.error("Error fetching markets:", error);

        // Return cached data if available, even if expired, as fallback
        if (cachedMarkets) {
            return cachedMarkets;
        }

        return [];
    }
}

// React cache for deduplication within a single request + module-level cache across requests
export const getMarkets = cache(_fetchMarkets);

// Cached i18n config derived from markets
export const getI18nConfig = cache(async () => {
    const markets = await getMarkets();

    const countryCodes = markets.map((location: Location) => location.country.code);
    const countries = Array.from(new Set(countryCodes));

    const localeSet = new Set<string>();
    markets.forEach(market => {
        market.locales.forEach(locale => localeSet.add(locale));
    });
    const locales = Array.from(localeSet);

    return {
        countries,
        locales,
        defaultCountry: DEFAULT_COUNTRY,
        defaultLocale: DEFAULT_LOCALE,
    };
});

export const getDefaultCountry = async (): Promise<Country> => {
    const config = await getI18nConfig();
    return config.defaultCountry;
}

export const getDefaultLocale = async (): Promise<Locale> => {
    const config = await getI18nConfig();
    return config.defaultLocale;
};

// For server components that need countries/locales, use these async versions
export const getCountries = async (): Promise<Country[]> => {
    const config = await getI18nConfig();
    return config.countries;
}

export const getLocales = async (): Promise<Locale[]> => {
    const config = await getI18nConfig();
    return config.locales;
}

export const getCountryLocaleMapping = async (): Promise<Record<Country, Locale[]>> => {
    const markets = await getMarkets();
    const mapping: Record<Country, Locale[]> = {};

    markets.forEach(market => {
        mapping[market.country.code] = market.locales;
    });

    return mapping;
}

export const getLocalesForCountry = async (countryCode: string): Promise<string[]> => {
    const markets = await getMarkets();
    const market = markets.find(m => m.country.code.toLowerCase() === countryCode.toLowerCase());
    return market?.locales || [];
}


export type Locale = string;
export type Country = string;


