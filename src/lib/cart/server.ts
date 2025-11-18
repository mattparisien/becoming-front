import { cookies } from 'next/headers';
import { Plugin } from '@/lib/types/plugin';

interface CartItem extends Plugin {
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

/**
 * Read cart data from cookies on the server
 * This is read-only - use client-side store for mutations
 */
export async function getServerCart(): Promise<CartState> {
  const cookieStore = await cookies();
  const cartCookie = cookieStore.get('cart-storage');
  
  if (!cartCookie?.value) {
    return { items: [] };
  }

  try {
    const parsed = JSON.parse(cartCookie.value);
    return parsed.state || { items: [] };
  } catch (error) {
    console.error('Failed to parse cart cookie:', error);
    return { items: [] };
  }
}

/**
 * Get total items count from server-side cart
 */
export async function getServerCartItemCount(): Promise<number> {
  const cart = await getServerCart();
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Get total price from server-side cart
 */
export async function getServerCartTotalPrice(): Promise<number> {
  const cart = await getServerCart();
  return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
}
