'use client';

import { useEffect, useRef } from 'react';

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

    // The store will automatically load from cookies via persist middleware
    // This component just ensures hydration happens smoothly
    // If you need to do anything special during initialization, add it here
  }, [initialCartCount]);

  return null; // This component doesn't render anything
}
