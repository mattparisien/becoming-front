import { create } from 'zustand';

// Cart item as returned from the Shopify-based API
export interface CartItem {
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
}

interface CartCost {
  total: number;
  subtotal: number;
  currencyCode: string;
}

interface CartResponse {
  id: string | null;
  checkoutUrl: string | null;
  items: CartItem[];
  totalQuantity: number;
  cost: CartCost | null;
  error?: string;
}

interface CartState {
  cartId: string | null;
  checkoutUrl: string | null;
  items: CartItem[];
  totalQuantity: number;
  cost: CartCost | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => void;
  
  // Computed (for backwards compatibility)
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CART_API_ENDPOINT = '/api/cart';

async function fetchCart(method: string, body?: unknown): Promise<CartResponse> {
  const init: RequestInit = {
    method,
    credentials: 'same-origin',
  };

  if (body) {
    init.headers = { 'Content-Type': 'application/json' };
    init.body = JSON.stringify(body);
  }

  const response = await fetch(CART_API_ENDPOINT, init);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Cart request failed');
  }

  return data;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cartId: null,
  checkoutUrl: null,
  items: [],
  totalQuantity: 0,
  cost: null,
  isInitialized: false,
  isLoading: false,
  error: null,

  initializeCart: async () => {
    if (get().isInitialized) return;
    set({ isLoading: true, error: null });

    try {
      const data = await fetchCart('GET');
      set({
        cartId: data.id,
        checkoutUrl: data.checkoutUrl,
        items: data.items || [],
        totalQuantity: data.totalQuantity || 0,
        cost: data.cost,
        isInitialized: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to initialize cart:', error);
      set({
        isInitialized: true,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load cart',
      });
    }
  },

  addItem: async (variantId: string, quantity = 1) => {
    set({ isLoading: true, error: null });

    try {
      const data = await fetchCart('POST', {
        lines: [{ merchandiseId: variantId, quantity }],
      });

      set({
        cartId: data.id,
        checkoutUrl: data.checkoutUrl,
        items: data.items || [],
        totalQuantity: data.totalQuantity || 0,
        cost: data.cost,
        isLoading: false,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Failed to add item:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to add item',
      });
      throw error;
    }
  },

  updateQuantity: async (lineId: string, quantity: number) => {
    if (!get().cartId) return;
    set({ isLoading: true, error: null });

    try {
      if (quantity <= 0) {
        await get().removeItem(lineId);
        return;
      }

      const data = await fetchCart('PATCH', {
        lines: [{ id: lineId, quantity }],
      });

      set({
        cartId: data.id,
        checkoutUrl: data.checkoutUrl,
        items: data.items || [],
        totalQuantity: data.totalQuantity || 0,
        cost: data.cost,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to update quantity:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update quantity',
      });
      throw error;
    }
  },

  removeItem: async (lineId: string) => {
    if (!get().cartId) return;
    set({ isLoading: true, error: null });

    try {
      const data = await fetchCart('DELETE', { lineIds: [lineId] });

      set({
        cartId: data.id,
        checkoutUrl: data.checkoutUrl,
        items: data.items || [],
        totalQuantity: data.totalQuantity || 0,
        cost: data.cost,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to remove item:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to remove item',
      });
      throw error;
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });

    try {
      await fetchCart('DELETE', {});
      set({
        cartId: null,
        checkoutUrl: null,
        items: [],
        totalQuantity: 0,
        cost: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to clear cart:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to clear cart',
      });
    }
  },

  checkout: () => {
    const checkoutUrl = get().checkoutUrl;
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  },

  getTotalItems: () => {
    return get().totalQuantity;
  },

  getTotalPrice: () => {
    return get().cost?.total || 0;
  },
}));
