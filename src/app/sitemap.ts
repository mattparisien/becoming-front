import { MetadataRoute } from 'next';
import { getAllPageParams, getAllProductParams } from '@/lib/helpers/staticParams';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  const sitemapEntries: MetadataRoute.Sitemap = [];

  try {
    // Add shop page (the actual homepage destination after redirect)
    sitemapEntries.push({
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });

    // Get all pages and add unique slugs (canonical URLs without locale/country)
    const pages = await getAllPageParams();
    const uniquePageSlugs = new Set<string>();
    
    for (const page of pages) {
      const slug = page.slug.join('/');
      if (!uniquePageSlugs.has(slug)) {
        uniquePageSlugs.add(slug);
        sitemapEntries.push({
          url: `${baseUrl}/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }

    // Get all products and add unique handles (canonical URLs without locale/country)
    const products = await getAllProductParams();
    const uniqueProductSlugs = new Set<string>();
    
    for (const product of products) {
      if (!uniqueProductSlugs.has(product.slug)) {
        uniqueProductSlugs.add(product.slug);
        sitemapEntries.push({
          url: `${baseUrl}/products/${product.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.7,
        });
      }
    }

    return sitemapEntries;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the base URL if something fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
