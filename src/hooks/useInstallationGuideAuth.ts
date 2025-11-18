import { cookies } from 'next/headers';

interface InstallationGuideAuthResult {
    isAuthenticated: boolean;
}

export async function checkInstallationGuideAuth(
    slug: string
): Promise<InstallationGuideAuthResult> {
    // Check for authentication cookie
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(`installation-guide-auth-${slug}`);
    
    // If no cookie exists, not authenticated
    if (!authCookie?.value) {
        return { isAuthenticated: false };
}

    // Validate cookie with the external API
    const apiKey = process.env.PLUGIN_API_KEY;
    const apiUrl = process.env.PLUGIN_API_URL;

    if (!apiKey || !apiUrl) {
        console.error('Missing PLUGIN_API_KEY or PLUGIN_API_URL environment variables');
        return { isAuthenticated: false };
    }

    try {
        const authApiUrl = `${apiUrl}/${slug}/auth`;

        // Bypass SSL verification in development
        if (process.env.NODE_ENV !== 'production') {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        }

        const apiResponse = await fetch(authApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify({ password: authCookie.value }),
        });

        // Re-enable SSL verification
        if (process.env.NODE_ENV !== 'production') {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
        }

        if (!apiResponse.ok) {
            return { isAuthenticated: false };
        }

        const apiData = await apiResponse.json();

        return { isAuthenticated: apiData.isAuthenticated || false };
    } catch (error) {
        console.error('Auth check error:', error);
        return { isAuthenticated: false };
    }
}
