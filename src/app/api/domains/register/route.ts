import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { websiteUrl, shopifyProductIds, customerEmail } = await req.json();

    if (!websiteUrl) {
      return NextResponse.json(
        { error: 'Website URL is required' },
        { status: 400 }
      );
    }

    if (!shopifyProductIds || shopifyProductIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one plugin is required' },
        { status: 400 }
      );
    }

    // Call your backend API to register the domain
    const backendUrl = process.env.BECOMING_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/admin/domains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        websiteUrl,
        shopifyProductIds,
        customerEmail,
        notes: 'Registered via checkout flow',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Failed to register domain' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Domain registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
