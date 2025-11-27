import { cookies } from 'next/headers';
import { Plugin } from '@/lib/types/plugin';
import { CART_SESSION_COOKIE, LEGACY_CART_COOKIE } from '@/lib/cart/constants';

const BECOMING_API_URL = process.env.BECOMING_API_URL || 'http://localhost:3001';
const BECOMING_API_KEY = process.env.BECOMING_API_KEY || '';

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
async function fetchCartSession(cartId: string): Promise<CartState | null> {
  try {
    const response = await fetch(`${BECOMING_API_URL}/api/cart/ ${cartId}`, {
      headers: {
        'x-api-key': BECOMING_API_KEY,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json().catch(() => ({}));
    return data?.items ? { items: data.items } : { items: [] };
  } catch (error) {
    console.error('Failed to fetch cart session:', error);
    return null;
  }
}

export async function getServerCart(): Promise<CartState> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(CART_SESSION_COOKIE);

  if (sessionCookie?.value) {
    const cart = await fetchCartSession(sessionCookie.value);
    if (cart) {
      return cart;
    }
  }

  const legacyCookie = cookieStore.get(LEGACY_CART_COOKIE);

  if (!legacyCookie?.value) {
    return { items: [] };
  }

  try {
    const parsed = JSON.parse(legacyCookie.value);
    return parsed.state || { items: [] };
  } catch (error) {
    console.error('Failed to parse legacy cart cookie:', error);
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
