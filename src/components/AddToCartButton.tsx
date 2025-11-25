'use client';

import Button from '@/components/ui/Button';
import { type Locale } from '@/lib/i18n/config';
import { getProductPageTranslations } from '@/lib/i18n/translations';
import { ShopifyProduct, ShopifyProductFlattened } from '@/lib/types/shopify';
import { useCartStore } from '@/store/cartStore';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useCartDrawer } from '@/context/CartDrawerContext';

interface AddToCartButtonProps {
  product: ShopifyProduct | ShopifyProductFlattened;
}

// Type guard to check if product is flattened
function isFlattened(product: ShopifyProduct | ShopifyProductFlattened): product is ShopifyProductFlattened {
  return 'src' in ((product as ShopifyProductFlattened).media || {});
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const { lang } = useParams();
  const t = getProductPageTranslations(lang as Locale);

  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { open: openCartDrawer } = useCartDrawer();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = () => {
    // Handle both flattened and non-flattened product structures
    const firstVariant = isFlattened(product)
      ? product.variants[0]
      : product.variants.edges[0]?.node;

    const imageUrl = isFlattened(product)
      ? product.media.src
      : product.media.edges[0]?.node?.image?.url || '';

    const mediaType = isFlattened(product)
      ? product.media.mediaType
      : (product.media.edges[0]?.node?.image ? 'image' : 'video');

    const mimeType = isFlattened(product)
      ? product.media.mimeType
      : product.media.edges[0]?.node?.sources?.[0]?.mimeType;

    const price = parseFloat(product.priceRange.maxVariantPrice.amount);

    // Convert Shopify product to cart item format
    const cartItem = {
      id: product.id,
      gid: product.id,
      variantId: firstVariant?.id || '',
      variantGid: firstVariant?.id || '',
      name: product.title,
      description: product.descriptionHtml,
      price: price,
      image: imageUrl,
      mediaType: mediaType as 'image' | 'video',
      mimeType: mimeType,
      category: product.productType || '',
      featured: false,
      size: 'medium' as const
    };

    addItem(cartItem);
    setIsAdded(true);

    // Open the cart drawer
    openCartDrawer();

    // Reset the success message after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <Button
      ref={buttonRef}
      onClick={handleAddToCart}
      size="lg"
      fullWidth
      disabled={isAdded}
    >
      {isAdded ? t.addedSuccessfully : t.addToCart}
    </Button>
  );
};

export default AddToCartButton;
