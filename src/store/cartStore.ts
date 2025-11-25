import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Plugin } from '@/lib/types/plugin';

interface CartItem extends Plugin {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (plugin: Plugin) => void;
  removeItem: (pluginId: string) => void;
  updateQuantity: (pluginId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  checkout: (metadata?: { internalUrl: string; agreedToPrivacy: boolean; customId?: string }) => Promise<void>;
}

// Custom cookie storage
const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  },
  setItem: (name: string, value: string): void => {
    if (typeof document === 'undefined') return;
    // Set cookie to expire in 30 days
    const expires = new Date();
    expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  },
  removeItem: (name: string): void => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (plugin) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === plugin.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === plugin.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { ...plugin, quantity: 1 }],
          };
        }),

      removeItem: (pluginId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== pluginId),
        })),

      updateQuantity: (pluginId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === pluginId ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      checkout: async (metadata) => {
        const items = get().items;

        if (!items.length) {
          throw new Error('Cart is empty');
        }

        try {
   
          // Transform cart items to Shopify line items format
          const lineItems = items.map((item) => ({
            variantId: item.variantGid,
            quantity: item.quantity,
          }));

          const response = await fetch('/api/shopify/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              lineItems,
              metadata: metadata || {},
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to create checkout');
          }

          // Redirect to Shopify checkout page
          if (data.url) {
            // Optionally clear cart before redirect
            // get().clearCart();
            window.location.href = data.url;
          } else {
            throw new Error('No checkout URL received');
          }
        } catch (error) {
          console.error('Checkout failed:', error);
          throw error;
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
