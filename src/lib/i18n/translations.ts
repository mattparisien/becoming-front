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

export interface MenuTranslations {
  madeIn: string;
}

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
  back: string;
  checkoutDetails: string;
  internalUrlLabel: string;
  internalUrlPlaceholder: string;
  internalUrlHelp: string;
  internalUrlTooltip: string;
  continueToCheckout: string;
  internalUrlRequired: string;
  confirmationHeading: string;
  confirmationAgree: string;
  privacyPolicy: string;
  termsOfService: string;
  confirmationText: string;
  confirmationRequired: string;
  checkoutDisabledMessage: string;
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
  disclaimer: string;
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
  notSelected: string;
}

export const MenuTranslations : Record<Locale, MenuTranslations> = {
  "en": {
    madeIn: 'Made with ♡ in Montreal, Tiohtià:ke',
  },
  "fr": {
    madeIn: 'Construit avec ♡ à Montréal, Tiohtià:ke',
  },
};

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
    back: 'Back',
    checkoutDetails: 'Checkout Details',
    internalUrlLabel: 'Squarespace Internal URL',
    internalUrlPlaceholder: 'mywebsite.squarespace.com',
    internalUrlHelp: 'This is the internal URL where the plugin will be installed',
    internalUrlTooltip: 'This is the backend URL of your Squarespace website (e.g., https://your-site.squarespace.com). You can find this in your Squarespace dashboard under Settings → Domains. This is different from your public domain name. We use this to activate your unlimited use license.',
    continueToCheckout: 'Continue to Checkout',
    internalUrlRequired: 'Internal URL is required',
    confirmationHeading: 'Confirmation',
    confirmationAgree: 'I agree to the',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    confirmationText: ', and confirm this plugin is compatible with my Squarespace website and plan, outlined in the product description.',
    confirmationRequired: 'You must agree to the terms and conditions',
    checkoutDisabledMessage: 'Checkout will be enabled soon. We are currently setting up payment processing.',
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
    back: 'Retour',
    checkoutDetails: 'Détails de la commande',
    internalUrlLabel: 'URL interne Squarespace',
    internalUrlPlaceholder: 'monsite.squarespace.com',
    internalUrlHelp: 'Il s\'agit de l\'URL interne où le plugin sera installé',
    internalUrlTooltip: 'Il s\'agit de l\'URL backend de votre site Web Squarespace (par exemple, https://votre-site.squarespace.com). Vous pouvez la trouver dans votre tableau de bord Squarespace sous Paramètres → Domaines. Elle est différente de votre nom de domaine public. Nous l\'utilisons pour activer votre licence d\'utilisation illimitée.',
    continueToCheckout: 'Continuer vers la commande',
    internalUrlRequired: 'L\'URL interne est requise',
    confirmationHeading: 'Confirmation',
    confirmationAgree: 'J\'accepte les',
    privacyPolicy: 'Politique de confidentialité',
    termsOfService: 'Conditions d\'utilisation',
    confirmationText: ', et confirme que ce plugin est compatible avec mon site Web et mon forfait Squarespace, .',
    confirmationRequired: 'Vous devez accepter les termes et conditions',
    checkoutDisabledMessage: 'Le paiement sera bientôt activé. Nous configurons actuellement le traitement des paiements.',
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
    madeIn: 'Made with ♥ in Montreal, Tiohtià:ke',
    contactUs: 'Get in Touch',
    allRightsReserved: 'All rights reserved.',
    disclaimer: 'Becoming Plugins is not affiliated, sponsored, or endorsed by Squarespace. The term "Squarespace" is the registered trademark and property of Squarespace, Inc.',
  },
  "fr": {
    followUs: 'Suivez-nous',
    madeIn: 'Construit avec ♥ à Montréal, Tiohtià:ke',
    contactUs: 'Contactez-nous',
    allRightsReserved: 'Tous droits réservés.',
    disclaimer: 'Becoming Plugins n\'est pas affilié, parrainé ou approuvé par Squarespace. Le terme « Squarespace » est la marque déposée et la propriété de Squarespace, Inc.',
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
    notSelected: 'not selected',
  },
  "fr": {
    title: 'Sélectionnez votre emplacement',
    description: 'Êtes-vous sûr de vouloir changer de pays ? Cela peut affecter votre expérience d\'achat.',
    currentLocation: 'Votre emplacement actuel est défini sur',
    select: 'Sélectionner',
    confirm: 'Confirmer',
    cancel: 'Annuler',
    notSelected: 'pas sélectionné',
  },
};

export function getMenuTranslations(locale: Locale): MenuTranslations {
  return MenuTranslations[locale] || MenuTranslations[defaultLocale];
}

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