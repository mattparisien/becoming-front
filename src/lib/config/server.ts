/**
 * Server-side configuration module
 * Provides global configuration values for server components
 * Fetches from Sanity and caches the results with module-level cache
 */

import { cache } from 'react';
import { getGlobalData } from '../fetchers/globals';
import { getDefaultLocale } from '../i18n/config';

interface ServerConfig {
  brandName: string;
  siteUrl: string;
  contactEmail: string;
  tagline?: string;
  description?: string;
}

// Module-level cache
let cachedConfig: ServerConfig | null = null;
let lastFetchTime: number = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Internal function to fetch config from Sanity
 * Uses module-level cache to persist across requests
 */
async function _fetchServerConfig(): Promise<ServerConfig> {
  const now = Date.now();
  
  // Return cached config if still valid
  if (cachedConfig && (now - lastFetchTime) < CACHE_TTL) {
    console.log('[ServerConfig] Using cached config');
    return cachedConfig;
  }

  console.log('[ServerConfig] Fetching fresh config from Sanity');

  try {
    // Get default locale for global data
    const defaultLocale = await getDefaultLocale();
    
    // Fetch global data from Sanity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalData = await getGlobalData(defaultLocale) as any;
    
    // Extract configuration values
    const brandName = globalData?.brand?.brandName || process.env.BRAND_NAME || 'Candlelight';
    const contactEmail = globalData?.contactEmail || process.env.CONTACT_EMAIL || 'hello@candlelight.com';
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    const tagline = globalData?.brand?.tagline;
    const description = globalData?.brand?.description;

    const config: ServerConfig = {
      brandName,
      siteUrl,
      contactEmail,
      ...(tagline && { tagline }),
      ...(description && { description }),
    };

    // Update cache
    cachedConfig = config;
    lastFetchTime = now;

    return config;
  } catch (error) {
    console.error('[ServerConfig] Error fetching global data:', error);
    
    // If we have stale cache, return it
    if (cachedConfig) {
      console.log('[ServerConfig] Using stale cache due to error');
      return cachedConfig;
    }
    
    // Last resort: fallback to environment variables
    const fallbackConfig: ServerConfig = {
      brandName: process.env.BRAND_NAME || 'Brand Name',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
      contactEmail: process.env.CONTACT_EMAIL || 'youremail@yourdomain.com',
    };

    // Cache the fallback
    cachedConfig = fallbackConfig;
    lastFetchTime = now;

    return fallbackConfig;
  }
}

/**
 * Get server configuration with React cache for request deduplication
 * AND module-level cache for cross-request persistence
 */
const getServerConfig = cache(async (): Promise<ServerConfig> => {
  return _fetchServerConfig();
});

/**
 * Get just the brand name
 */
export async function getBrandName(): Promise<string> {
  const config = await getServerConfig();
  return config.brandName;
}

/**
 * Get just the site URL
 */
export async function getSiteUrl(): Promise<string> {
  const config = await getServerConfig();
  return config.siteUrl;
}

/**
 * Get contact email
 */
export async function getContactEmail(): Promise<string> {
  const config = await getServerConfig();
  return config.contactEmail;
}

export { getServerConfig };
