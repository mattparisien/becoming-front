// app/api/shopify/checkout/route.ts
import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify/storefront";

interface UserError {
  field: string[];
  message: string;
}

interface CartLine {
  node: {
    id: string;
    quantity: number;
  };
}

interface Cart {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: CartLine[];
  };
}

interface CartCreateResponse {
  cartCreate: {
    cart: Cart | null;
    userErrors: UserError[];
  };
}

export async function POST(req: Request) {
  try {
    const { lineItems } = await req.json();

    // Use the newer Cart API instead of deprecated Checkout API
    const mutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Transform line items to cart lines format
    const cartInput = {
      lines: lineItems.map((item: { variantId: string; quantity: number }) => ({
        merchandiseId: item.variantId,
        quantity: item.quantity,
      })),
    };

    const data = await shopifyFetch<CartCreateResponse>(mutation, { input: cartInput });
    const { cart, userErrors } = data.cartCreate;

    if (userErrors && userErrors.length > 0) {
      console.error('Cart creation errors:', userErrors);
      return NextResponse.json(
        { error: 'Failed to create cart', details: userErrors },
        { status: 400 }
      );
    }

    if (!cart || !cart.checkoutUrl) {
      return NextResponse.json(
        { error: 'No checkout URL returned' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: cart.checkoutUrl });
  } catch (error: unknown) {
    console.error('Checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
