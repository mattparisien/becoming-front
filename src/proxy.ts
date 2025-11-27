import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCountries, getDefaultCountry, getDefaultLocale, getLocales, getLocalesForCountry, type Locale, type Country} from "./lib/i18n/config";
import { getBasePathRedirect } from "./lib/i18n/locales";
import { LOCATION_PREFERENCES_COOKIE_KEY } from './lib/constants';

const COOKIE_KEY = LOCATION_PREFERENCES_COOKIE_KEY;

// Get the preferred locale from browser headers
async function getLocale(request: NextRequest): Promise<Locale> {
    const locales = await getLocales();
    const defaultLocale = await getDefaultLocale();
    
    // Try to get locale from cookie first
    const cookie = request.cookies.get(COOKIE_KEY)?.value;
    if (cookie) {
        try {
            const prefs = JSON.parse(cookie);
            if (prefs && typeof prefs.locale === 'string' && locales.includes(prefs.locale as Locale)) {
                return prefs.locale as Locale;
            }
        } catch {
            // ignore parse errors, fallback to Accept-Language
        }
    }

    // Fallback to Accept-Language header
    try {
        const headersObject: Record<string, string> = {};
        request.headers.forEach((value, key) => {
            headersObject[key] = value;
        });
        const languages = new Negotiator({ headers: headersObject }).languages();
        
        // Filter out invalid language tags before passing to match
        const validLanguages = languages.filter((lang) => {
            try {
                // Test if this is a valid locale by trying to canonicalize it
                Intl.getCanonicalLocales(lang);
                return true;
            } catch {
                return false;
            }
        });
        
        // If no valid languages found, use default
        if (validLanguages.length === 0) {
            return defaultLocale;
        }
        
        const upperLocales = locales.map((l: string) => l.toUpperCase());
        const upperDefault = defaultLocale.toUpperCase();
        return match(validLanguages, upperLocales, upperDefault).toLowerCase() as Locale;
    } catch (error) {
        // If locale matching fails, return default locale
        console.error('Locale matching error:', error);
        return defaultLocale;
    }
}

// Get the preferred country from cookie or use default
async function getCountry(request: NextRequest): Promise<Country> {
    const countries = await getCountries();
    const defaultCountry = await getDefaultCountry();
    
    // Try to get country from cookie first
    const cookie = request.cookies.get(COOKIE_KEY)?.value;
    
    if (cookie) {
        try {
            const prefs = JSON.parse(cookie);
            if (prefs && typeof prefs.country === 'string' && countries.includes(prefs.country as Country)) {
                return prefs.country as Country;
            }
        } catch {
            // ignore parse errors, fallback to default
        }
    }
    return defaultCountry;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Fetch i18n configuration at runtime
    const locales = await getLocales();
    const countries = await getCountries();

    // Check if pathname matches /[country]/[lang]/... pattern
    const pathParts = pathname.split('/').filter(Boolean);


    // Check if first two segments look like country/locale attempt
    const hasCountryLikePattern = pathParts.length >= 2;
    const firstPartIsCountry = countries.includes(pathParts[0] as Country);
    const secondPartIsLocale = locales.includes(pathParts[1] as Locale);


    // Only treat as country/locale pattern if first part is 2 chars (country-like)
    const firstPartLooksLikeCountry = pathParts.length >= 1 && pathParts[0].length === 2;
    
    // Check if the locale is valid for the specific country
    const validLocalesForCountry = firstPartIsCountry ? await getLocalesForCountry(pathParts[0] as Country) : [];
    const secondPartIsValidForCountry = validLocalesForCountry.includes(pathParts[1] as Locale);

    const hasValidCountryAndLocale = hasCountryLikePattern
        && firstPartIsCountry
        && secondPartIsLocale
        && secondPartIsValidForCountry;

    // Handle invalid country/locale combinations (only if first part looks like a country code)
    
    // 1) valid country + locale that exists globally but is NOT valid for this country (e.g., /ca/fr-fr)
    // => let Next.js handle the 404
    if (hasCountryLikePattern && firstPartLooksLikeCountry && firstPartIsCountry && secondPartIsLocale && !secondPartIsValidForCountry) {
        // Locale exists globally but not valid for this country -> 404
        return NextResponse.next();
    }
    
    // 2) valid country + invalid locale (e.g., /ca/ts where ts doesn't exist at all)
    // => redirect to detected locale for that country
    if (hasCountryLikePattern && firstPartLooksLikeCountry && firstPartIsCountry && !secondPartIsLocale) {
        // Invalid locale: e.g., /ca/ts -> redirect to /ca/en (or detected locale)
        const detectedLocale = await getLocale(request);
        const restOfPath = pathParts.slice(2).join('/');
        request.nextUrl.pathname = restOfPath
            ? `/${pathParts[0]}/${detectedLocale}/${restOfPath}`
            : `/${pathParts[0]}/${detectedLocale}`;
        return NextResponse.redirect(request.nextUrl);
    }

    // 3) invalid country + valid locale (e.g., /xx/en)
    // => redirect to detected country + that locale
    if (hasCountryLikePattern && firstPartLooksLikeCountry && !firstPartIsCountry && secondPartIsLocale) {
        // Invalid country: e.g., /xx/en -> redirect to /us/en (or detected country)
        const detectedCountry = await getCountry(request);
        const restOfPath = pathParts.slice(2).join('/');
        request.nextUrl.pathname = restOfPath
            ? `/${detectedCountry}/${pathParts[1]}/${restOfPath}`
            : `/${detectedCountry}/${pathParts[1]}`;
        return NextResponse.redirect(request.nextUrl);
    }

    // 4) invalid country + invalid locale (e.g., /xx/yy)
    // => redirect to detected country + detected locale
    if (hasCountryLikePattern && firstPartLooksLikeCountry && !firstPartIsCountry && !secondPartIsLocale) {
        // Both invalid: e.g., /xx/yy -> redirect to detected country/locale
        const detectedCountry = await getCountry(request);
        const detectedLocale = await getLocale(request);
        const restOfPath = pathParts.slice(2).join('/');
        request.nextUrl.pathname = restOfPath
            ? `/${detectedCountry}/${detectedLocale}/${restOfPath}`
            : `/${detectedCountry}/${detectedLocale}`;
        return NextResponse.redirect(request.nextUrl);
    }

    // Extract country and locale from path or detect them
    const country: Country = hasValidCountryAndLocale
        ? pathParts[0] as Country
        : await getCountry(request);

    const locale: Locale = hasValidCountryAndLocale
        ? pathParts[1] as Locale
        : await getLocale(request);

    // Redirect ONLY root base country/locale path to configured base path (e.g., /us/en -> /us/en/shop)
    // Also redirect bare root path / to base path
    if (pathname === '/' || pathname === '') {
        const detectedCountry = await getCountry(request);
        const detectedLocale = await getLocale(request);
        request.nextUrl.pathname = getBasePathRedirect(detectedCountry, detectedLocale);
        return NextResponse.redirect(request.nextUrl);
    }

    if (pathname === `/${country}/${locale}` || pathname === `/${country}/${locale}/`) {
        request.nextUrl.pathname = getBasePathRedirect(country, locale);
        return NextResponse.redirect(request.nextUrl)
    }

    // If URL already has valid country and locale for non-base paths, don't redirect
    if (hasValidCountryAndLocale) {
        const response = NextResponse.next();
        response.headers.set('x-pathname', pathname);
        return response;
    }

    // For paths without valid country/locale, prepend the country and locale
    // (e.g., /products/magnetic-button -> /us/en/products/magnetic-button)
    const detectedCountry = await getCountry(request);
    const detectedLocale = await getLocale(request);
    const newPath = `/${detectedCountry}/${detectedLocale}${pathname}`;
    request.nextUrl.pathname = newPath;

    return NextResponse.redirect(request.nextUrl)
}

// Export as default middleware for Next.js
export default proxy;

export const config = {
    matcher: [
        // Skip all internal paths, static assets, and API routes
        '/((?!_next|favicon.ico|robots.txt|sitemap.xml|assets|images|fonts|api).*)',
    ],
}