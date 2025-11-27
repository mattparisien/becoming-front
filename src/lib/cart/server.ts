import { cookies } from 'next/headers';
import { getCart, type ShopifyCart } from '@/lib/shopify/storefront/cart';

const CART_COOKIE_NAME = 'shopify_cart_id';

export interface ServerCartItem {
  lineId: string;
  quantity: number;
  variantId: string;
  variantTitle: string;
  productId: string;
  productTitle: string;
  productHandle: string;
  productType: string;
  description: string;
  descriptionHtml: string;
  price: number;
  currencyCode: string;
  image: string;
  imageAlt: string;
  mediaType: 'image' | 'video';
  mimeType: string;
}

export interface ServerCartData {
  id: string | null;
  checkoutUrl: string | null;
  items: ServerCartItem[];
  totalQuantity: number;
  cost: {
    total: number;
    subtotal: number;
    currencyCode: string;
  } | null;
}

function formatCartData(cart: ShopifyCart | null): ServerCartData {
  if (!cart) {
    return { id: null, checkoutUrl: null, items: [], totalQuantity: 0, cost: null };
  }

  const items = cart.lines.edges.map(({ node }) => {
    const product = node.merchandise.product;
    const firstMedia = product.media?.edges?.[0]?.node;
    
    // Determine media type and URL
    let mediaUrl = '';
    let mediaType: 'image' | 'video' = 'image';
    let mimeType = '';
    
    if (firstMedia) {
      if ('mediaContentType' in firstMedia) {
        if (firstMedia.mediaContentType === 'VIDEO' && 'sources' in firstMedia) {
          const videoSource = firstMedia.sources?.[0];
          if (videoSource) {
            mediaUrl = videoSource.url;
            mediaType = 'video';
            mimeType = videoSource.mimeType || 'video/mp4';
          }
        } else if (firstMedia.mediaContentType === 'IMAGE' && 'image' in firstMedia) {
          mediaUrl = firstMedia.image?.url || '';
          mediaType = 'image';
        }
      }
    }
    
    // Fallback to variant image or featured image
    if (!mediaUrl) {
      mediaUrl = node.merchandise.image?.url || product.featuredImage?.url || '';
      mediaType = 'image';
    }

    return {
      lineId: node.id,
      quantity: node.quantity,
      variantId: node.merchandise.id,
      variantTitle: node.merchandise.title,
      productId: product.id,
      productTitle: product.title,
      productHandle: product.handle,
      productType: product.productType,
      description: product.description,
      descriptionHtml: product.descriptionHtml,
      price: parseFloat(node.merchandise.price.amount),
      currencyCode: node.merchandise.price.currencyCode,
      image: mediaUrl,
      imageAlt: node.merchandise.image?.altText || product.featuredImage?.altText || '',
      mediaType,
      mimeType,
    };
  });

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    items,
    totalQuantity: cart.totalQuantity,
    cost: {
      total: parseFloat(cart.cost.totalAmount.amount),
      subtotal: parseFloat(cart.cost.subtotalAmount.amount),
      currencyCode: cart.cost.totalAmount.currencyCode,
    },
  };
}

/**
 * Fetch the full cart from Shopify on the server
 * This is used to hydrate the client store without a client-side fetch
 */
export async function getServerCart(): Promise<ServerCartData> {
  const cookieStore = await cookies();
  const cartIdCookie = cookieStore.get(CART_COOKIE_NAME);

  if (!cartIdCookie?.value) {
    return { id: null, checkoutUrl: null, items: [], totalQuantity: 0, cost: null };
  }

  try {
    const cart = await getCart(cartIdCookie.value, 'CA', 'EN');
    return formatCartData(cart);
  } catch (error) {
    console.error('Failed to fetch server cart:', error);
    return { id: null, checkoutUrl: null, items: [], totalQuantity: 0, cost: null };
  }
}

/**
 * Get total items count from server-side cart
 */
export async function getServerCartItemCount(): Promise<number> {
  const cart = await getServerCart();
  return cart.totalQuantity;
}
