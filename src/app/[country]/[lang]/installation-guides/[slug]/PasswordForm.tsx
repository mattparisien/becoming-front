'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { getPasswordProtectTranslations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';
import { useRouter } from 'next/navigation';
import { authenticateInstallationGuide } from '@/lib/auth/installationGuideAuth';

interface PasswordProtectFormProps {
    slug: string;
    locale: string;
}

export default function PasswordProtectForm({ slug, locale }: PasswordProtectFormProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const t = getPasswordProtectTranslations(locale as Locale);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // Validate password is not empty
        if (!password || password.trim().length === 0) {
            setError(t.enterPassword);
            setIsSubmitting(false);
            return;
        }

        const result = await authenticateInstallationGuide(slug, password);

        if (result.success) {
            // Refresh the page to re-render with authenticated content
            router.refresh();
        } else {
            setError(result.error || t.incorrectPassword);
            setPassword('');
        }

        setIsSubmitting(false);
    };

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
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-background text-foreground disabled:opacity-50"
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t.loading : t.submit}
                    </Button>
                </form>
            </div>
        </div>
    );
}
