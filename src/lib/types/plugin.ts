export interface Plugin {
  id: string;
  gid: string; // Global ID for the plugin
  variantId: string;
  variantGid: string;
  name: string;
  description: string;
  price: number;
  image: string;
  mediaType?: 'image' | 'video'; // Type of media
  mimeType?: string; // MIME type for videos
  category: string;
  featured: boolean;
  size: "small" | "medium" | "large";
  shopifyProductId: string; // Shopify product GID for backend
  shopifyVariantId?: string; // Shopify variant ID for checkout
}
