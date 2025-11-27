import { fetchSanityData } from "@/hooks/useServerSideSanityQuery";
import { Metadata, ResolvedMetadata } from "next";
import { getCountryLocaleMapping } from "../i18n/config";
import { SEO_QUERY } from "../sanity/queries";

interface MetadataParams {
    country: string;
    lang: string;
    slug: string[];
    type: string;
}

interface SeoData {
    seo: {
        title: string;
        description?: string;
        excludeFromSearchResults?: boolean;
    };
}

/**
 * Generates metadata for a route by fetching SEO data from Sanity
 * and constructing canonical URLs and language alternates
 */
export const generateRouteMetadata = async (
    params: MetadataParams,
    parentMeta: ResolvedMetadata
): Promise<Metadata> => {
    const { country, lang, slug } = params;

    // Join slug array to get the first segment (e.g., ['hello', 'bonjour'] -> 'hello')
    const slugString = slug[0];

    // Extract parent metadata
    const globalDescription = parentMeta.description;
    const globalTitle = parentMeta.title?.absolute;
    const globalOG = parentMeta.openGraph || {};

    // Fetch SEO data from Sanity
    const data = await fetchSanityData<SeoData | null>(
        SEO_QUERY,
        { params: { language: lang, slug: slugString, type: params.type } }
    );

    // Get i18n configuration
    const [countryLocaleMap] = await Promise.all([
        getCountryLocaleMapping()
    ]);

    // Construct base URL
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    const baseUrl = siteUrl.replace(/\/$/, ''); // Remove trailing slash

    // Generate canonical URL (without locale/country - the preferred single version)
    const canonicalUrl = `${baseUrl}/${slugString}`;

    // Generate language alternates
    const languageAlternates: Record<string, string> = {};

    Object.entries(countryLocaleMap).forEach(([countryCode, locales]) => {
        locales.forEach(locale => {
            // Format: en-US, fr-CA, etc.
            const hreflangCode = `${locale}-${countryCode.toUpperCase()}`;
            languageAlternates[hreflangCode] = `${baseUrl}/${countryCode}/${locale}/${slugString}`;
        });
    });

    // Add x-default alternate (points to default)
    languageAlternates['x-default'] = canonicalUrl;

    // If no SEO data, return parent metadata with canonical
    if (!data?.seo) {
        return {
            ...(globalTitle && typeof globalTitle === 'string' ? { title: globalTitle } : {}),
            ...(globalDescription ? { description: globalDescription } : {}),
            openGraph: globalOG,
            alternates: {
                canonical: canonicalUrl,
                languages: languageAlternates,
            }
        };
    }

    const { title, description, excludeFromSearchResults } = data.seo;
    const hasPageTitle = typeof title === 'string' && title.trim().length > 0;
    const hasPageDescription = typeof description === 'string' && description.trim().length > 0;
    
    // Use page title if available, otherwise fall back to global title
    const finalTitle = hasPageTitle ? title : globalTitle;

    return {
        ...(finalTitle ? { title: finalTitle } : {}),
        ...(hasPageDescription ? { description } : {}),
        openGraph: {
            ...globalOG,
            ...(finalTitle ? { title: finalTitle } : {}),
            ...(hasPageDescription ? { description } : {}),
            url: `${baseUrl}/${country}/${lang}/${slugString}`,
        },
        robots: {
            index: !excludeFromSearchResults,
            follow: !excludeFromSearchResults,
            googleBot: {
                index: !excludeFromSearchResults,
                follow: !excludeFromSearchResults,
                noimageindex: excludeFromSearchResults,
            },
        },
        alternates: {
            canonical: canonicalUrl,
            languages: languageAlternates,
        }
    };
};
