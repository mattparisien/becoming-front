import { Country, Locale } from '@/lib/i18n/config';

interface LocaleConfig {
  basePathRedirect: string;
}

type LocaleCountryKey = 'us-en' | 'ca-en' | 'ca-fr';

export const localeConfig: Record<LocaleCountryKey, LocaleConfig> = {
  "us-en": {
    basePathRedirect: '/shop',
  },
  "ca-en": {
    basePathRedirect: '/shop',
  },
  "ca-fr": {
    basePathRedirect: '/shop',
  },
};

export function getBasePathRedirect(country: Country, locale: Locale): string {
  const key = `${country}-${locale}` as LocaleCountryKey;
  return localeConfig[key] ? localeConfig[key].basePathRedirect : localeConfig['us-en'].basePathRedirect;
}