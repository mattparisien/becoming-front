import { Locale } from '@/lib/i18n/config';

// Supported languages configuration
export interface SupportedLanguage {
  id: string;
  title: string;
  nativeName: string;
  country?: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { id: 'en-us', title: 'English', nativeName: 'English', country: 'US' },
  { id: 'en-ca', title: 'English', nativeName: 'English', country: 'CA' },
  { id: 'fr-ca', title: 'French', nativeName: 'Français', country: 'CA' },
  { id: 'en', title: 'English', nativeName: 'English' },
  { id: 'fr', title: 'French', nativeName: 'Français' },
  { id: 'es', title: 'Spanish', nativeName: 'Español' },
  { id: 'de', title: 'German', nativeName: 'Deutsch' },
];

// Hardcoded fallback locale to avoid async calls at module level
const defaultLocale: Locale = 'en';

export interface CartDrawerTranslations {
  cart: string;
  closeCart: string;
  cartIsEmpty: string;
  continueShopping: string;
  total: string;
  checkout: string;
  processing: string;
  quantity: string;
  remove: string;
  decreaseQuantity: string;
  increaseQuantity: string;
  noImage: string;
}

export interface HeaderTranslations {
  menu: string;
  close: string;
  cart: string;
}

export interface ProductPageTranslations {
  shop: string;
  oneTimePurchase: string;
  whatsIncluded: string;
  lifetimeAccess: string;
  regularUpdates: string;
  premiumSupport: string;
  easyInstallation: string;
  addToCart: string;
  addedSuccessfully: string;
  demoLink: string;
}

export interface FooterTranslations {
  followUs: string;
  madeIn: string;
  contactUs: string;
  allRightsReserved: string;
}

export interface PasswordProtectTranslations {
  passwordRequired: string;
  protectedMessage: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submit: string;
  loading: string;
  incorrectPassword: string;
  enterPassword: string;
  configError: string;
}

export interface LocationModalTranslations {
  title: string;
  description: string;
  currentLocation: string;
  select: string;
  confirm: string;
  cancel: string;
}

export const cartDrawerTranslations: Record<Locale, CartDrawerTranslations> = {
  "en": {
    cart: 'Cart',
    closeCart: 'Close cart',
    cartIsEmpty: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    total: 'Total',
    checkout: 'Checkout',
    processing: 'Processing...',
    quantity: 'Quantity',
    remove: 'Remove',
    decreaseQuantity: 'Decrease quantity',
    increaseQuantity: 'Increase quantity',
    noImage: 'No image',
  },
  "fr": {
    cart: 'Panier',
    closeCart: 'Fermer le panier',
    cartIsEmpty: 'Votre panier est vide',
    continueShopping: 'Continuer vos achats',
    total: 'Total',
    checkout: 'Passer la commande',
    processing: 'Traitement en cours...',
    quantity: 'Quantité',
    remove: 'Retirer',
    decreaseQuantity: 'Diminuer la quantité',
    increaseQuantity: 'Augmenter la quantité',
    noImage: 'Pas d\'image',
  },
};

export const headerTranslations: Record<Locale, HeaderTranslations> = {
  "en": {
    menu: 'Menu',
    close: 'Close',
    cart: 'Cart',
  },
  "fr": {
    menu: 'Menu',
    close: 'Fermer',
    cart: 'Panier',
  },
};

export const productPageTranslations: Record<Locale, ProductPageTranslations> = {
  "en": {
    shop: 'Shop',
    oneTimePurchase: 'One-time purchase',
    whatsIncluded: 'Nice to Know',
    lifetimeAccess: 'Lifetime access to plugin',
    regularUpdates: 'Regular updates and improvements',
    premiumSupport: 'Premium support',
    easyInstallation: 'Easy installation guide',
    addToCart: 'Add to Cart',
    addedSuccessfully: 'Added Successfully!',
    demoLink: 'See a live demo',
  },
  "fr": {
    shop: 'Boutique',
    oneTimePurchase: 'Achat unique',
    whatsIncluded: 'Bon à savoir',
    lifetimeAccess: 'Accès à vie au plugin',
    regularUpdates: 'Mises à jour et améliorations régulières',
    premiumSupport: 'Support premium',
    easyInstallation: 'Guide d\'installation facile',
    addToCart: 'Ajouter au panier',
    addedSuccessfully: 'Ajouté avec succès !',
    demoLink: 'Voir une démo en direct',
  },
};

export const footerTranslations: Record<Locale, FooterTranslations> = {
  "en": {
    followUs: 'Follow Us',
    madeIn: 'Made with ♥ in Montréal',
    contactUs: 'Get in Touch',
    allRightsReserved: 'All rights reserved.',
  },
  "fr": {
    followUs: 'Suivez-nous',
    madeIn: 'Construit avec ♥ à Montréal',
    contactUs: 'Contactez-nous',
    allRightsReserved: 'Tous droits réservés.',
  },
};

export const passwordProtectTranslations: Record<Locale, PasswordProtectTranslations> = {
  "en": {
    passwordRequired: 'Password Required',
    protectedMessage: 'This installation guide is password protected. Please enter the password to continue.',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    submit: 'Submit',
    loading: 'Loading...',
    incorrectPassword: 'Incorrect password. Please try again.',
    enterPassword: 'Please enter a password.',
    configError: 'Configuration error. Please contact support.',
  },
  "fr": {
    passwordRequired: 'Mot de passe requis',
    protectedMessage: 'Ce guide d\'installation est protégé par mot de passe. Veuillez entrer le mot de passe pour continuer.',
    passwordLabel: 'Mot de passe',
    passwordPlaceholder: 'Entrez le mot de passe',
    submit: 'Soumettre',
    loading: 'Chargement...',
    incorrectPassword: 'Mot de passe incorrect. Veuillez réessayer.',
    enterPassword: 'Veuillez entrer un mot de passe.',
    configError: 'Erreur de configuration. Veuillez contacter le support.',
  },
};

export const locationModalTranslations: Record<Locale, LocationModalTranslations> = {
  "en": {
    title: 'Select Your Location',
    description: 'Are you sure you want to switch countries? This may affect your shopping experience.',
    currentLocation: 'Your current location is set to',
    select: 'Select',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
  "fr": {
    title: 'Sélectionnez votre emplacement',
    description: 'Êtes-vous sûr de vouloir changer de pays ? Cela peut affecter votre expérience d\'achat.',
    currentLocation: 'Votre emplacement actuel est défini sur',
    select: 'Sélectionner',
    confirm: 'Confirmer',
    cancel: 'Annuler',
  },
};


export function getCartDrawerTranslations(locale: Locale): CartDrawerTranslations {
  return cartDrawerTranslations[locale] || cartDrawerTranslations[defaultLocale];
}

export function getHeaderTranslations(locale: Locale): HeaderTranslations {
  return headerTranslations[locale] || headerTranslations[defaultLocale];
}

export function getProductPageTranslations(locale: Locale): ProductPageTranslations {
  return productPageTranslations[locale] || productPageTranslations[defaultLocale];
}

export function getFooterTranslations(locale: Locale): FooterTranslations {
  return footerTranslations[locale] || footerTranslations[defaultLocale];
}

export function getPasswordProtectTranslations(locale: Locale): PasswordProtectTranslations {
  return passwordProtectTranslations[locale] || passwordProtectTranslations[defaultLocale];
}

export function getLocationModalTranslations(locale: Locale): LocationModalTranslations {
  return locationModalTranslations[locale] || locationModalTranslations[defaultLocale];
}