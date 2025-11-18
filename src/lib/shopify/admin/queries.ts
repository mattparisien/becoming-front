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

