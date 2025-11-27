'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';

interface CartStoreInitializerProps {
  initialCartCount: number;
}

/**
 * Initializes the cart store with server-side data
 * This ensures the store state matches what was rendered on the server
 * Prevents hydration mismatches and flashing of cart count
 */
export function CartStoreInitializer({ initialCartCount }: CartStoreInitializerProps) {
  const initialized = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (initialized.current) return;
    initialized.current = true;

    useCartStore.getState().initializeCart().catch((error) => {
      console.error('Cart initialization failed:', error);
    });
  }, [initialCartCount]);

  return null; // This component doesn't render anything
}
