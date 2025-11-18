
import { fetchExcludedSlugs } from "@/hooks/fetchPage";

// Next.js will use this to generate /robots.txt
export default async function robots() {
  // Disallow demo previews for all locales
  const excludedSlugs = await fetchExcludedSlugs();

  // Remove duplicates using Set
  const uniqueSlugs = [...new Set(excludedSlugs)];

  const disallow = [
    "/checkout",
    "/cart",
    ...uniqueSlugs
  ]
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
  };
}
