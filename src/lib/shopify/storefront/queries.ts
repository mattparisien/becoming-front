// Shopify Storefront API GraphQL Queries

export const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    descriptionHtml
    productType
    tags
    vendor
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
  }
`;

export const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image {
    url
    altText
  }
`;

export const VARIANT_FRAGMENT = `
  fragment VariantFragment on ProductVariant {
    id
    title
    priceV2 {
      amount
      currencyCode
    }
    availableForSale
  }
`;

export const GET_PRODUCTS_QUERY = `
  query getProducts(
    $first: Int!,
    $query: String,
    $country: CountryCode!,
    $language: LanguageCode!
  ) @inContext(country: $country, language: $language) {
    products(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          productType
          tags
          vendor
          seo {
            title
            description
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  query getProductByHandle(
    $handle: String!,
    $country: CountryCode!,
    $language: LanguageCode!
  ) @inContext(country: $country, language: $language) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      productType
      tags
      vendor
      seo {
        title
        description
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE_QUERY = `
  query getCollectionByHandle($handle: String!, $first: Int!, $language: LanguageCode) @inContext(language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      products(first: $first, sortKey: CREATED, reverse: true) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            productType
            tags
            vendor
            seo {
              title
              description
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_MARKETS_QUERY = `
query getLocalization {
    markets: localization { availableCountries {
      name
      isoCode
      currency {
        name
        isoCode
        symbol
      }
    }
  }
}
`;  
