import { NextResponse } from "next/server";

const BECOMING_API_URL = process.env.BECOMING_API_URL || 'http://localhost:3001';
const BECOMING_API_KEY = process.env.BECOMING_API_KEY || '';

/**
 * POST /api/orders/pending
 * 
 * Creates a pending order in the backend before Shopify checkout.
 * 
 * Flow:
 * 1. Frontend calls this endpoint with shopifyProductIds and metadata (including internalUrl)
 * 2. This endpoint forwards the request to the backend API server
 * 3. Backend creates a PendingOrder with a unique customId
 * 4. customId is returned and included in Shopify checkout attributes
 * 5. When Shopify webhook fires (order confirmed), backend uses customId to:
 *    - Find the pending order
 *    - Register the domain using stored internalUrl
 *    - Mark pending order as fulfilled
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shopifyProductIds, metadata } = body;

    // Validate required fields
    if (!shopifyProductIds || !Array.isArray(shopifyProductIds) || shopifyProductIds.length === 0) {
      return NextResponse.json(
        { error: 'shopifyProductIds array is required' },
        { status: 400 }
      );
    }

    if (!metadata || !metadata.internalUrl) {
      return NextResponse.json(
        { error: 'metadata.internalUrl is required' },
        { status: 400 }
      );
    }

    // Call the backend API to create pending order
    const response = await fetch(`${BECOMING_API_URL}/api/orders/pending`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': BECOMING_API_KEY,
      },
      body: JSON.stringify({
        shopifyProductIds,
        metadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Backend API error:', errorData);
      return NextResponse.json(
        { error: errorData.error || 'Failed to create pending order' },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log(`✅ Pending order created via Next.js API:`, {
      customId: data.customId,
      shopifyProductIds,
    });

    return NextResponse.json(data, { status: 201 });

  } catch (error: unknown) {
    console.error('❌ Error in pending order API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to check pending order status
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customId = searchParams.get('customId');

    if (!customId) {
      return NextResponse.json(
        { error: 'customId query parameter is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BECOMING_API_URL}/api/orders/pending-order/${customId}`, {
      headers: {
        'x-api-key': BECOMING_API_KEY,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Pending order not found' },
          { status: 404 }
        );
      }
      
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Failed to fetch pending order' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: unknown) {
    console.error('❌ Error fetching pending order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
