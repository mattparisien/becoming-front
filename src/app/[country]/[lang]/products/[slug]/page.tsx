import { fetchShopifyProduct } from "@/hooks/fetchPage";
import { getBrandName, getSiteUrl } from "@/lib/config/server";
import { getAllProductParams } from "@/lib/helpers/staticParams";
import { Country, getCountryLocaleMapping, Locale } from "@/lib/i18n/config";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import ProductPageComponent from "./component";
import { getProduct } from "@/lib/fetchers/products";

type Props = {
  params: Promise<{ lang: Locale; country: Country; category: string; slug: string }>
};

export async function generateStaticParams() {
  return await getAllProductParams();
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { lang, country, slug } = await params;
  const parentMeta = await parent;

  const product = await fetchShopifyProduct(slug, lang, country);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  // Extract parent metadata for fallback
  const globalDescription = parentMeta.description;
  const globalTitle = parentMeta.title;
  const globalOG = parentMeta.openGraph || {};

  // Use Shopify SEO data if available, otherwise fallback to product data, then parent
  const title = product.seo?.title || product.title || (typeof globalTitle === 'string' ? globalTitle : 'Product');
  const description = product.seo?.description || product.description || globalDescription || '';
  const ogImage = product.media?.src && product.media.mediaType === 'image' ? product.media.src : undefined;

  // Get i18n configuration for alternates
  const [countryLocaleMap] = await Promise.all([
    getCountryLocaleMapping()
  ]);

  // Construct base URL
  const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  const baseUrl = siteUrl.replace(/\/$/, ''); // Remove trailing slash

  // Generate canonical URL (without locale/country)
  const canonicalUrl = `${baseUrl}/products/${slug}`;

  // Generate language alternates
  const languageAlternates: Record<string, string> = {};

  Object.entries(countryLocaleMap).forEach(([countryCode, locales]) => {
    locales.forEach(locale => {
      // Format: en-US, fr-CA, etc.
      const hreflangCode = `${locale}-${countryCode.toUpperCase()}`;
      languageAlternates[hreflangCode] = `${baseUrl}/${countryCode}/${locale}/products/${slug}`;
    });
  });

  // Add x-default alternate (points to canonical)
  languageAlternates['x-default'] = canonicalUrl;

  return {
    title,
    description,
    openGraph: {
      ...globalOG,
      title,
      description,
      url: `${baseUrl}/${country}/${lang}/products/${slug}`,
      images: ogImage ? [{ url: ogImage, alt: product.title }] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    },
  };
}

export default async function Page({ params }: Props) {
  const { country, lang, slug } = await params;
  
  const product = await getProduct({ slug, country, lang });
console.log('product, ', product);
  if (!product) {
    notFound();
  }

  // Get server configuration
  const [brandName, siteUrl] = await Promise.all([
    getBrandName(),
    getSiteUrl()
  ]);

  // Get price
  const price = parseFloat(product.priceRange.maxVariantPrice.amount);

  // Check if any variant is available for sale
  const isAvailable = product.variants.some((variant: { availableForSale: boolean }) => variant.availableForSale);

  // Construct base URL
  const baseUrl = siteUrl.replace(/\/$/, '');

  // Generate Product JSON-LD structured data
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || product.seo?.description || '',
    image: product.media?.src ? [product.media.src] : [],
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/${country}/${lang}/products/${product.handle}`,
      priceCurrency: product.priceRange.maxVariantPrice.currencyCode,
      price: price.toFixed(2),
      availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: brandName,
      },
    },
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductPageComponent {...product} />
    </>
  );
}
