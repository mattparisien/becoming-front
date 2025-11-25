import { ShopifyProduct, ShopifyProductFlattened } from '@/lib/types/shopify';

/**
 * Helper function to flatten media from Shopify GraphQL response
 * Handles both image and video media types
 */
export function flattenMedia(mediaEdges: ShopifyProduct['media']['edges']): ShopifyProductFlattened['media'] {
  const firstMedia = mediaEdges[0]?.node;
  
  if (!firstMedia) {
    return {
      mediaType: '',
      src: '',
    };
  }

  // Handle image media
  if (firstMedia.image) {
    return {
      mediaType: 'image',
      src: firstMedia.image.url,
      mimeType: 'image/jpeg',
    };
  }

  // Handle video media
  if (firstMedia.sources && firstMedia.sources.length > 0) {
    // Prefer video/mp4, fallback to first available source
    const preferredSource = firstMedia.sources.find(s => s.mimeType === 'video/mp4') || firstMedia.sources[0];
    
    return {
      mediaType: firstMedia.mediaType.toLowerCase(),
      src: preferredSource.url,
      mimeType: preferredSource.mimeType,
    };
  }

  // Fallback for unknown media types
  return {
    mediaType: firstMedia.mediaType?.toLowerCase() || '',
    src: '',
  };
}
