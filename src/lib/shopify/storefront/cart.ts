// Shopify Storefront Cart API

import { shopifyStorefrontFetch } from './client';

// Cart fragment for consistent cart data
const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              image {
                url
                altText
              }
              price {
                amount
                currencyCode
              }
              product {
                id
                title
                handle
                productType
                description
                descriptionHtml
                featuredImage {
                  url
                  altText
                }
                media(first: 1) {
                  edges {
                    node {
                      ... on MediaImage {
                        image {
                          url
                          altText
                        }
                        mediaContentType
                      }
                      ... on Video {
                        sources {
                          url
                          mimeType
                        }
                        mediaContentType
                      }
                      ... on ExternalVideo {
                        embedUrl
                        mediaContentType
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL Mutations
const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!, $country: CountryCode!, $language: LanguageCode!)
  @inContext(country: $country, language: $language) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const ADD_TO_CART_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!, $country: CountryCode!, $language: LanguageCode!)
  @inContext(country: $country, language: $language) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const UPDATE_CART_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!, $country: CountryCode!, $language: LanguageCode!)
  @inContext(country: $country, language: $language) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const REMOVE_FROM_CART_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!, $country: CountryCode!, $language: LanguageCode!)
  @inContext(country: $country, language: $language) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const GET_CART_QUERY = `
  query getCart($cartId: ID!, $country: CountryCode!, $language: LanguageCode!)
  @inContext(country: $country, language: $language) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`;

// Types
interface MediaImage {
  image: {
    url: string;
    altText?: string;
  };
  mediaContentType: 'IMAGE';
}

interface MediaVideo {
  sources: Array<{
    url: string;
    mimeType: string;
  }>;
  mediaContentType: 'VIDEO';
}

interface MediaExternalVideo {
  embedUrl: string;
  mediaContentType: 'EXTERNAL_VIDEO';
}

type ProductMedia = MediaImage | MediaVideo | MediaExternalVideo;

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    image?: {
      url: string;
      altText?: string;
    };
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      id: string;
      title: string;
      handle: string;
      productType: string;
      description: string;
      descriptionHtml: string;
      featuredImage?: {
        url: string;
        altText?: string;
      };
      media?: {
        edges: Array<{ node: ProductMedia }>;
      };
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    edges: Array<{ node: ShopifyCartLine }>;
  };
}

interface CartResponse {
  cart: ShopifyCart | null;
}

interface CartMutationResponse {
  cart: ShopifyCart | null;
  userErrors: Array<{ field: string[]; message: string }>;
}

// Default context values
const DEFAULT_COUNTRY = 'CA';
const DEFAULT_LANGUAGE = 'EN';

// API Functions
export async function createCart(
  lines: Array<{ merchandiseId: string; quantity: number }>,
  country = DEFAULT_COUNTRY,
  language = DEFAULT_LANGUAGE
): Promise<ShopifyCart | null> {
  const response = await shopifyStorefrontFetch<{ cartCreate: CartMutationResponse }>({
    query: CREATE_CART_MUTATION,
    variables: {
      input: { lines },
      country,
      language,
    },
  });

  if (response.cartCreate.userErrors.length > 0) {
    console.error('Cart creation errors:', response.cartCreate.userErrors);
    throw new Error(response.cartCreate.userErrors[0].message);
  }

  return response.cartCreate.cart;
}

export async function getCart(
  cartId: string,
  country = DEFAULT_COUNTRY,
  language = DEFAULT_LANGUAGE
): Promise<ShopifyCart | null> {
  try {
    const response = await shopifyStorefrontFetch<CartResponse>({
      query: GET_CART_QUERY,
      variables: { cartId, country, language },
    });
    return response.cart;
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    return null;
  }
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>,
  country = DEFAULT_COUNTRY,
  language = DEFAULT_LANGUAGE
): Promise<ShopifyCart | null> {
  const response = await shopifyStorefrontFetch<{ cartLinesAdd: CartMutationResponse }>({
    query: ADD_TO_CART_MUTATION,
    variables: { cartId, lines, country, language },
  });

  if (response.cartLinesAdd.userErrors.length > 0) {
    console.error('Add to cart errors:', response.cartLinesAdd.userErrors);
    throw new Error(response.cartLinesAdd.userErrors[0].message);
  }

  return response.cartLinesAdd.cart;
}

export async function updateCartLine(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>,
  country = DEFAULT_COUNTRY,
  language = DEFAULT_LANGUAGE
): Promise<ShopifyCart | null> {
  const response = await shopifyStorefrontFetch<{ cartLinesUpdate: CartMutationResponse }>({
    query: UPDATE_CART_MUTATION,
    variables: { cartId, lines, country, language },
  });

  if (response.cartLinesUpdate.userErrors.length > 0) {
    console.error('Update cart errors:', response.cartLinesUpdate.userErrors);
    throw new Error(response.cartLinesUpdate.userErrors[0].message);
  }

  return response.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[],
  country = DEFAULT_COUNTRY,
  language = DEFAULT_LANGUAGE
): Promise<ShopifyCart | null> {
  const response = await shopifyStorefrontFetch<{ cartLinesRemove: CartMutationResponse }>({
    query: REMOVE_FROM_CART_MUTATION,
    variables: { cartId, lineIds, country, language },
  });

  if (response.cartLinesRemove.userErrors.length > 0) {
    console.error('Remove from cart errors:', response.cartLinesRemove.userErrors);
    throw new Error(response.cartLinesRemove.userErrors[0].message);
  }

  return response.cartLinesRemove.cart;
}
