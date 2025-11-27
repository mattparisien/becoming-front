'use client';

import { useRef } from 'react';
import { useCartStore, type CartItem } from '@/store/cartStore';

interface ServerCartData {
  id: string | null;
  checkoutUrl: string | null;
  items: CartItem[];
  totalQuantity: number;
  cost: {
    total: number;
    subtotal: number;
    currencyCode: string;
  } | null;
}

interface CartStoreInitializerProps {
  initialCart: ServerCartData;
}

/**
 * Hydrates the cart store with server-fetched data
 * This ensures the store state matches what was rendered on the server
 * No client-side fetch needed - prevents flash/glitch on page load
 */
export function CartStoreInitializer({ initialCart }: CartStoreInitializerProps) {
  const initialized = useRef(false);

  // Hydrate store synchronously on first render (before effects run)
  if (!initialized.current) {
    initialized.current = true;
    useCartStore.setState({
      cartId: initialCart.id,
      checkoutUrl: initialCart.checkoutUrl,
      items: initialCart.items,
      totalQuantity: initialCart.totalQuantity,
      cost: initialCart.cost,
      isInitialized: true,
      isLoading: false,
      error: null,
    });
  }

  return null;
}
