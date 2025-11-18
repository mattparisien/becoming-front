'use client';

import { useState, useEffect } from 'react';
import Button from './ui/Button';
import { useParams } from 'next/navigation';
import { getPasswordProtectTranslations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';

interface PasswordProtectProps {
    children: React.ReactNode;
    correctPassword: string;
    slug: string;
}

const PasswordProtect = ({ children, correctPassword, slug }: PasswordProtectProps) => {
    const params = useParams();
    const locale = (params?.locale as Locale) || 'en'; // Fallback to 'en' if no locale
    const t = getPasswordProtectTranslations(locale);
    
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Check if already authenticated in session storage
    useEffect(() => {
        const storageKey = `installation-guide-auth-${slug}`;
        const storedAuth = sessionStorage.getItem(storageKey);
                
        // Only authenticate if both stored and correct passwords are non-empty and match
        if (storedAuth && correctPassword && storedAuth.trim().length > 0 && storedAuth === correctPassword) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, [slug, correctPassword]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate password is not empty
        if (!password || password.trim().length === 0) {
            setError(t.enterPassword);
            return;
        }

        // Validate correctPassword is not empty (security check)
        if (!correctPassword || correctPassword.trim().length === 0) {
            setError(t.configError);
            return;
        }

        if (password === correctPassword) {
            const storageKey = `installation-guide-auth-${slug}`;
            sessionStorage.setItem(storageKey, password);
            setIsAuthenticated(true);
        } else {
            setError(t.incorrectPassword);
            setPassword('');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg">{t.loading}</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen-minus-header flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-sans mb-4">{t.passwordRequired}</h1>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                {t.passwordLabel}
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-background text-foreground"
                                placeholder={t.passwordPlaceholder}
                                autoFocus
                            />
                            {error && (
                                <p className="mt-2 text-sm text-red-600">{error}</p>
                            )}
                        </div>
                        
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            {t.submit}
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default PasswordProtect;
