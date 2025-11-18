'use server';

import { cookies } from 'next/headers';
import { Plugin } from '@/lib/types/plugin';

interface CartItem extends Plugin {
  quantity: number;
}

interface CartState {
  state: {
    items: CartItem[];
  };
  version: number;
}

/**
 * Server action to update cart in cookies
 * This syncs with client-side Zustand store
 */
export async function updateServerCart(items: CartItem[]): Promise<void> {
  const cookieStore = await cookies();
  
  const cartData: CartState = {
    state: { items },
    version: 0,
  };

  const expires = new Date();
  expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  cookieStore.set('cart-storage', JSON.stringify(cartData), {
    expires,
    path: '/',
    sameSite: 'lax',
  });
}

/**
 * Server action to clear cart
 */
export async function clearServerCart(): Promise<void> {
  await updateServerCart([]);
}

/**
 * Server action to apply a discount or modify cart items
 * Example: Apply a promotion that modifies prices
 */
export async function applyServerSideDiscount(discountPercent: number): Promise<void> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get('cart-storage');
  
  if (!cartCookie?.value) return;

  try {
    const parsed: CartState = JSON.parse(cartCookie.value);
    const items = parsed.state.items.map(item => ({
      ...item,
      price: item.price * (1 - discountPercent / 100),
    }));

    await updateServerCart(items);
  } catch (error) {
    console.error('Failed to apply discount:', error);
  }
}
