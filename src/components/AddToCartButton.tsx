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
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { open: openCartDrawer } = useCartDrawer();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAddToCart = async () => {
    // Get the first variant ID (Shopify variant GID)
    const firstVariant = isFlattened(product)
      ? product.variants[0]
      : product.variants.edges[0]?.node;

    const variantId = firstVariant?.id;

    if (!variantId) {
      console.error('No variant ID found for product');
      return;
    }

    setIsLoading(true);

    try {
      await addItem(variantId);
      setIsAdded(true);
      openCartDrawer();

      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      ref={buttonRef}
      onClick={handleAddToCart}
      size="lg"
      fullWidth
      disabled={isLoading}
    >
      {isLoading ? '...' : isAdded ? t.addedSuccessfully : t.addToCart}
    </Button>
  );
};

export default AddToCartButton;
