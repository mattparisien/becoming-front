import { MetadataRoute } from 'next';
import { getUniqueSlugs, getUniqueProductHandles } from '@/lib/helpers/staticParams';

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

    // Get unique page slugs (without country/locale duplication)
    const pageSlugs = await getUniqueSlugs();
    
    for (const slug of pageSlugs) {
      sitemapEntries.push({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    // Get unique product handles (without country/locale duplication)
    const productHandles = await getUniqueProductHandles();
    
    for (const handle of productHandles) {
      sitemapEntries.push({
        url: `${baseUrl}/products/${handle}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      });
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
