import { Locale } from "../i18n/config";
import { Country } from "../i18n/config";

export const toShopifyLanguage = (locale: Locale): string => {
    return locale.toUpperCase();
}

export const toShopifyCountry = (countryCode: Country): string => {
    return countryCode.toUpperCase();
}
