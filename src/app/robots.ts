
import { fetchExcludedSlugs } from "@/hooks/fetchPage";

// Next.js will use this to generate /robots.txt
export default async function robots() {
  // Disallow demo previews for all locales
  const excludedSlugs = await fetchExcludedSlugs();

  // Remove duplicates using Set

  const disallow = [
    "/checkout",
    "/cart",
    "/demos",
    "/installation-guides"
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
