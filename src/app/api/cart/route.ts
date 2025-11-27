import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createCart,
  getCart,
  addToCart,
  updateCartLine,
  removeFromCart,
  type ShopifyCart,
} from "@/lib/shopify/storefront/cart";

const CART_COOKIE_NAME = "shopify_cart_id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getContextFromHeaders(_req: Request) {
  // Could extract from headers or URL if needed
  return { country: "CA", language: "EN" };
}

function formatCartResponse(cart: ShopifyCart | null) {
  if (!cart) {
    return { id: null, checkoutUrl: null, items: [], totalQuantity: 0, cost: null };
  }

  const items = cart.lines.edges.map(({ node }) => ({
    lineId: node.id,
    quantity: node.quantity,
    variantId: node.merchandise.id,
    variantTitle: node.merchandise.title,
    productId: node.merchandise.product.id,
    productTitle: node.merchandise.product.title,
    productHandle: node.merchandise.product.handle,
    productType: node.merchandise.product.productType,
    description: node.merchandise.product.description,
    descriptionHtml: node.merchandise.product.descriptionHtml,
    price: parseFloat(node.merchandise.price.amount),
    currencyCode: node.merchandise.price.currencyCode,
    image: node.merchandise.image?.url || node.merchandise.product.featuredImage?.url || "",
    imageAlt: node.merchandise.image?.altText || node.merchandise.product.featuredImage?.altText || "",
  }));

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    items,
    totalQuantity: cart.totalQuantity,
    cost: {
      total: parseFloat(cart.cost.totalAmount.amount),
      subtotal: parseFloat(cart.cost.subtotalAmount.amount),
      currencyCode: cart.cost.totalAmount.currencyCode,
    },
  };
}

// GET - Fetch existing cart
export async function GET(req: Request) {
  const cookieStore = await cookies();
  const cartIdCookie = cookieStore.get(CART_COOKIE_NAME);

  if (!cartIdCookie?.value) {
    return NextResponse.json(formatCartResponse(null));
  }

  try {
    const { country, language } = getContextFromHeaders(req);
    const cart = await getCart(cartIdCookie.value, country, language);

    if (!cart) {
      // Cart expired or invalid, clear cookie
      const response = NextResponse.json(formatCartResponse(null));
      response.cookies.delete({ name: CART_COOKIE_NAME, path: "/" });
      return response;
    }

    return NextResponse.json(formatCartResponse(cart));
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST - Create cart or add items
export async function POST(req: Request) {
  try {
    const { country, language } = getContextFromHeaders(req);
    const body = await req.json();
    const { lines } = body as { lines: Array<{ merchandiseId: string; quantity: number }> };

    if (!lines || !Array.isArray(lines) || lines.length === 0) {
      return NextResponse.json(
        { error: "At least one line item is required" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const cartIdCookie = cookieStore.get(CART_COOKIE_NAME);
    let cart: ShopifyCart | null = null;

    if (cartIdCookie?.value) {
      // Try to add to existing cart
      try {
        cart = await addToCart(cartIdCookie.value, lines, country, language);
      } catch {
        // Cart might be expired, create new one
        cart = await createCart(lines, country, language);
      }
    } else {
      // Create new cart
      cart = await createCart(lines, country, language);
    }

    if (!cart) {
      return NextResponse.json(
        { error: "Failed to create/update cart" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(formatCartResponse(cart));
    response.cookies.set({
      name: CART_COOKIE_NAME,
      value: cart.id,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: CART_COOKIE_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error("Failed to create/add to cart:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create cart" },
      { status: 500 }
    );
  }
}

// PATCH - Update line quantities
export async function PATCH(req: Request) {
  const cookieStore = await cookies();
  const cartIdCookie = cookieStore.get(CART_COOKIE_NAME);

  if (!cartIdCookie?.value) {
    return NextResponse.json(
      { error: "No cart found" },
      { status: 404 }
    );
  }

  try {
    const { country, language } = getContextFromHeaders(req);
    const body = await req.json();
    const { lines } = body as { lines: Array<{ id: string; quantity: number }> };

    if (!lines || !Array.isArray(lines)) {
      return NextResponse.json(
        { error: "Lines array is required" },
        { status: 400 }
      );
    }

    const cart = await updateCartLine(cartIdCookie.value, lines, country, language);

    if (!cart) {
      return NextResponse.json(
        { error: "Failed to update cart" },
        { status: 500 }
      );
    }

    return NextResponse.json(formatCartResponse(cart));
  } catch (error) {
    console.error("Failed to update cart:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE - Remove items from cart
export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  const cartIdCookie = cookieStore.get(CART_COOKIE_NAME);

  if (!cartIdCookie?.value) {
    return NextResponse.json({ success: true });
  }

  try {
    const { country, language } = getContextFromHeaders(req);
    const body = await req.json().catch(() => ({}));
    const { lineIds } = body as { lineIds?: string[] };

    if (lineIds && lineIds.length > 0) {
      // Remove specific lines
      const cart = await removeFromCart(cartIdCookie.value, lineIds, country, language);
      return NextResponse.json(formatCartResponse(cart));
    }

    // Clear cart cookie (effectively "delete" the cart reference)
    const response = NextResponse.json({ success: true, items: [] });
    response.cookies.delete({ name: CART_COOKIE_NAME, path: "/" });
    return response;
  } catch (error) {
    console.error("Failed to remove from cart:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to remove from cart" },
      { status: 500 }
    );
  }
}
