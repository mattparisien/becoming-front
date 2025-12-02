'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

interface ConditionalAnalyticsProps {
  gaId: string;
}

// Declare gtag type
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params: Record<string, string>
    ) => void;
  }
}

const ConditionalAnalytics = ({ gaId }: ConditionalAnalyticsProps) => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    // Check if analytics cookies are enabled
    const checkAnalyticsConsent = () => {
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        const preferences: CookiePreferences = JSON.parse(savedPreferences);
        setAnalyticsEnabled(preferences.analytics);
        
        // Update Google Analytics consent mode
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('consent', 'update', {
            analytics_storage: preferences.analytics ? 'granted' : 'denied',
          });
        }
      }
    };

    // Check on mount
    checkAnalyticsConsent();

    // Listen for storage changes (when user updates preferences)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === COOKIE_PREFERENCES_KEY) {
        checkAnalyticsConsent();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for changes within the same tab
    const handleCustomEvent = () => {
      checkAnalyticsConsent();
    };
    window.addEventListener('cookiePreferencesChanged', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cookiePreferencesChanged', handleCustomEvent);
    };
  }, []);

  // Only render Google Analytics if analytics cookies are enabled
  if (!analyticsEnabled) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
};

export default ConditionalAnalytics;
