/**
 * Client-side authentication helper for installation guides
 */

interface AuthenticateResult {
    success: boolean;
    error?: string;
}

export async function authenticateInstallationGuide(
    slug: string,
    password: string
): Promise<AuthenticateResult> {
    try {
        const response = await fetch('/api/installation-guides/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password,
                slug,
            }),
        });

        if (response.ok) {
            return { success: true };
        }

        const data = await response.json();
        return {
            success: false,
            error: data.error || 'Authentication failed',
        };
    } catch (error) {
        console.error('Auth error:', error);
        return {
            success: false,
            error: 'Network error. Please try again.',
        };
    }
}
