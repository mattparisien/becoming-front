
export const PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc)[]{
  ...
}`

export const PRODUCT_QUERY = `
    *[_type == "product" && store.slug.current == $slug][0]{
    ...,
    additionalInfo[language == $language]{
      content
    }[0],
    store{
      ...,
      variants[]->{
        ...
      }
    }
  }

`

export const THEME_QUERY = `*[_type == "theme" && title == "Site Theme"][0]{
  ...,
  palette->{
    "bg": backgroundColor->{
      name,
      value
    },
    "fg": foregroundColor->{
      name,
      value
    },
    "accent": accentColor->{
      name,
      value
    },
    "additional": additionalColors[]->{
      name,
      value
    }
  }
}`

export const GLOBAL_DATA_QUERY = `{
  "seo": *[_type == "settings"][0]{
    "seo": {
      "title": coalesce(
        localizedSeo[language == $locale][0].seo.title,
        seo.title
      ),
      "description": coalesce(
        localizedSeo[language == $locale][0].seo.description,
        seo.description
      ),
      "image": coalesce(
        localizedSeo[language == $locale][0].seo.image.asset->{
          url,
          "alt": alt
        },
        seo.image.asset->{
          url,
          "alt": alt
        },
        socialImage.asset->{
          url,
          "alt": "Social sharing image"
        }
      ),
      "ogImage": coalesce(
        localizedSeo[language == $locale][0].seo.ogImage.asset->{
          url,
          "alt": alt
        },
        seo.ogImage.asset->{
          url,
          "alt": alt
        },
        localizedSeo[language == $locale][0].seo.image.asset->{
          url,
          "alt": alt
        },
        seo.image.asset->{
          url,
          "alt": alt
        },
        socialImage.asset->{
          url,
          "alt": "Social sharing image"
        }
      ),
      "twitterImage": coalesce(
        localizedSeo[language == $locale][0].seo.twitterImage.asset->{
          url,
          "alt": alt
        },
        seo.twitterImage.asset->{
          url,
          "alt": alt
        },
        localizedSeo[language == $locale][0].seo.image.asset->{
          url,
          "alt": alt
        },
        seo.image.asset->{
          url,
          "alt": alt
        },
        socialImage.asset->{
          url,
          "alt": "Social sharing image"
        }
      ),
      "favicons": favicons{
        "favicon16": favicon16.asset->url,
        "favicon32": favicon32.asset->url,
        "favicon96": favicon96.asset->url,
        "favicon180": favicon180.asset->url,
        "favicon192": favicon192.asset->url,
        "favicon512": favicon512.asset->url
      }
    }
  }.seo,
  "menu": *[_type == "settings"][0]{
"navigation": *[_type == "translation.metadata" && ^.menu.navigation._ref in translations[].value._ref]{
  ...translations[_key == $locale][0].value-> {
    items[reference->isActive == true]{
      "title": coalesce(label, reference->title),
      "slug": reference->slug.current
    }
}
}[0],
      "theme": menu.theme->{
            palette->{
              "bg": backgroundColor->{
                name,
                value
              },
              "fg": foregroundColor->{
                name,
                value
              },
              "accent": accentColor->{
                name,
                value
              },
              "additional": additionalColors[]->{
                name,
                value
              }
            
          }
        }

  },
   "footer": *[_type == "settings"][0]{
    "footer": coalesce(
      localizedFooters[language == $locale][0].footer {
        navigations[]->{
          _id,
          title,
          items[]{
            label,
            "slug": reference->slug.current
          }
        },
        legalBar {
          navigation->{
            items[]{
              label,
              "slug": reference->slug.current
            }
          }
        }
      },
      footer {
        navigations
      }
    )
  }.footer
,
  "theme": *[_type == "theme" && title == "Site Theme"][0]{
    palette->{
      "bg": backgroundColor->{
        name,
        value
      },
      "fg": foregroundColor->{
        name,
        value
      },
      "accent": accentColor->{
        name,
        value
      },
      "additional": additionalColors[]->{
        name,
        value
      }
    }
  },
  "brand": *[_type == "settings"][0]{
    "title": *[_type == "settings"][0].siteTitle,
    "companyName": coalesce(
      localizedCompanyNames[language == $locale][0].companyName,
      localizedCompanyNames[language == "en"][0].companyName
    ),
    "tagline": coalesce(
      localizedTaglines[language == $locale][0].tagline,
      localizedTaglines[language == "en"][0].tagline
    ),
    "description": coalesce(
      localizedBrandDescriptions[language == $locale][0].description,
      localizedBrandDescriptions[language == "en"][0].description
    ),
    logo,
    logoAlt
  },
  "contactEmail": *[_type == "settings"][0].contactEmail,
  "socialLinks": *[_type == "settings"][0].socialLinks[],
  "languages": *[_type == "settings"][0].publishedLanguages[]{
    label,
    code
  }
}`;

export const PAGE_QUERY = `*[_type == "page" && slug.current == $slug && language == $locale && isActive == true]{
  title,
  "slug": slug.current,
  seo{
    title,
    description
    
  },
  "modules": modules[]{
    ...,
    _type == "products" => {
        "shopifyFetchCollectionKey": "product"
    },
  }
}`;

export const GET_ALL_PAGES_QUERY = `*[_type == "page" && isActive == true]{
   title,
  "slug": slug.current,
  seo{
    title,
    description
    
  },
  language,
  "modules": modules[]{
    ...,
    _type == "products" => {
        "shopifyFetchCollectionKey": "product"
    },
  }
}`;

export const GET_ALL_PAGE_SLUGS_QUERY = `*[_type == "page" && isActive == true && (!defined(seo.excludeFromSearchResults) || seo.excludeFromSearchResults == false)]{
  "slug": slug.current,
  "language": language
}`;

export const EXCLUDED_SLUGS_QUERY = `*[_type == "page" && seo.excludeFromSearchResults == true)]{ 
  _type == "demo" => {
    "slug": "/*" + "/demos/" + slug.current
  },
  _type == "installationGuide" => {
    "slug": "/*" + "/installation-guides/" + slug.current
  },
  _type == "page" => {
    "slug": slug.current
  }
 }`;

export const SEO_QUERY = `
  *[_type == $type && slug.current == $slug && isActive == true][0]{
      seo{
        title,
        description
      }
    }
`;

export const PAGE_NOT_FOUND_QUERY = `*[_type == "settings"][0]{
  ...coalesce(
    localizedNotFoundPages[language == $language][0]{
      ...notFound{
        title,
        body,
        buttonLabel,
            buttonLink[0]{
    _type == "linkInternal" => {
      ...reference->{
        title,
        "slug": slug.current
      }
    },
    _type == "linkExternal" => {
      url,
      newWindow
    }
  }
      }
    },
    notFoundPage{
       title,
       body,
       buttonLabel,
           buttonLink[0]{
    _type == "linkInternal" => {
      ...reference->{
        title,
        "slug": slug.current
      }
    },
    _type == "linkExternal" => {
      url,
      newWindow
    }
  }
    }
  )
}`

export const TARGET_PAGE_BY_SOURCE_LOCALE = `*[_type == "page" && slug.current == $slug && isActive == true][0]{
  ...*[
    _type == "translation.metadata" && references(^._id)
  ]{
    translations[value->language in $languages]{
    ...value->{
      title,
      "slug": slug.current,
      language
    }
  }
  }[0]
}`

export const DEMO_QUERY = `*[_type == "demo" && slug.current == $slug && language == $language]{
  title,
  "slug": slug.current,
  pluginJSON
}[0]`;

export const INSTALLATION_GUIDE_QUERY = `*[_type == "installationGuide" && slug.current == $slug && language == $language && isActive == true][0]{
  "title": product->store.title,
    "image": product->store{
      "url": previewImageUrl
    },
  content,
  "slug": {
    "current": product->store.slug.current
  }
}`

export const INSTALLATION_GUIDES_QUERY = `*[_type == "installationGuide" && isActive == true && language == $language]{
  "title": product->store.title,
    "image": product->store{
      "url": previewImageUrl
    },
  content,
  language,
  "slug": product->store.slug.current
}`