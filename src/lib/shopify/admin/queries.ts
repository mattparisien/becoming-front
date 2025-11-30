// Common Shopify Admin API GraphQL queries

export const GET_MARKETS_QUERY = `
query Markets {
    markets(first: 100) {
      nodes {
        name
        handle
        webPresence {
          rootUrls {
            locale
            url
          }
        }
        currencySettings {
            baseCurrency {
                currencyCode
            }
        }
      }
    }
  }

`;

// Admin API query to get products including drafts
export const GET_PRODUCTS_ADMIN_QUERY = `
  query getProducts($first: Int!, $query: String) {
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
          status
          priceRangeV2 {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          seo {
            title
            description
          }
          media(first: 10) {
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
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

// Admin API query to get a single product by handle including drafts
export const GET_PRODUCT_BY_HANDLE_ADMIN_QUERY = `
  query getProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      productType
      tags
      vendor
      status
      priceRangeV2 {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      seo {
        title
        description
      }
      media(first: 10) {
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
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price
            availableForSale
          }
        }
      }
    }
  }
`;
