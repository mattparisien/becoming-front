import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { password, slug } = await request.json();


        // Validate inputs
        if (!password || !slug) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate environment variables
        const apiKey = process.env.PLUGIN_API_KEY;
        const apiUrl = process.env.PLUGIN_API_URL;

        if (!apiKey || !apiUrl) {
            console.error('Missing PLUGIN_API_KEY or PLUGIN_API_URL environment variables');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }


        // Make request to external API to validate authentication
        const authApiUrl = `${apiUrl}/${slug}/auth`;
        
        // In development, we may need to bypass SSL certificate validation
        const fetchOptions: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({ password }),
        };

        // Bypass SSL verification in development (Node.js environment variable)
        if (process.env.NODE_ENV !== 'production') {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        }

        const apiResponse = await fetch(authApiUrl, fetchOptions);

        // Re-enable SSL verification after request
        if (process.env.NODE_ENV !== 'production') {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
        }


        if (apiResponse.status === 403) {
            console.error('API key authentication failed');
            return NextResponse.json(
                { error: 'Server authentication failed' },
                { status: 500 }
            );
        }


        if (!apiResponse.ok) {
            return NextResponse.json(
                { error: 'Authentication failed' },
                { status: apiResponse.status }
            );
        }

        const apiData = await apiResponse.json();

        if (!apiData.isAuthenticated) {
            return NextResponse.json(
                { error: 'Incorrect password' },
                { status: 401 }
            );
        }

        // Set HTTP-only cookie for this specific installation guide
        const cookieStore = await cookies();
        cookieStore.set(`installation-guide-auth-${slug}`, password, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
