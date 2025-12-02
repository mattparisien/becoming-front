'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { Locale } from '@/lib/i18n/config';
import { getCookieConsentTranslations } from '@/lib/i18n/translations';
import Button from '@/components/ui/Button';
import { useCookieConsent } from '@/context/CookieConsentContext';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  locale: Locale;
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

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_PREFERENCES_KEY = 'cookie-preferences';

const CookieConsent = ({ locale }: CookieConsentProps) => {
  const [showBanner, setShowBanner] = useState(false);
  const { showPreferences, openPreferences, closePreferences } = useCookieConsent();
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    // Initialize state from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        return JSON.parse(savedPreferences);
      }
    }
    return {
      necessary: true,
      analytics: false,
      marketing: false,
    };
  });

  const t = getCookieConsentTranslations(locale);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);

    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Lock body overflow when modal is active
    if (showPreferences) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showPreferences]);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyNecessary);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
    closePreferences();
    setShowBanner(false);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);

    // Dispatch custom event to notify ConditionalAnalytics of preference changes
    window.dispatchEvent(new Event('cookiePreferencesChanged'));

    // Update Google Analytics consent mode if gtag is available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        ad_storage: prefs.marketing ? 'granted' : 'denied',
      });
    }

    // Reload page if analytics was just enabled to load the script
    if (prefs.analytics && !preferences.analytics) {
      window.location.reload();
    }
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Cannot disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-0 left-0 right-0 z-[9999] bg-background border-t border-foreground/10 shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2 font-sans">
                    {t.title}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed font-sans">
                    {t.description}{' '}
                    <button
                      onClick={openPreferences}
                      className="underline decoration-solid hover:decoration-dashed transition-all"
                    >
                      {t.learnMore}
                    </button>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button
                    onClick={handleRejectAll}
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    {t.rejectAll}
                  </Button>
                  <Button
                    onClick={openPreferences}
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    {t.customize}
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    variant="primary"
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    {t.acceptAll}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={closePreferences}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90dvh] overflow-hidden"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-foreground/10">
                <h2 className="text-2xl font-semibold text-foreground font-sans">
                  {t.preferencesTitle}
                </h2>
                <button
                  onClick={closePreferences}
                  className="text-foreground/50 hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90dvh-200px)]">
                <p className="text-sm text-foreground/70 mb-6 leading-relaxed font-sans">
                  {t.preferencesDescription}
                </p>

                {/* Necessary Cookies */}
                <div className="mb-6 pb-6 border-b border-foreground/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-foreground mb-1 font-sans">
                        {t.necessaryTitle}
                      </h3>
                      <p className="text-sm text-foreground/60 leading-relaxed font-sans">
                        {t.necessaryDescription}
                      </p>
                    </div>
                    <div className="ml-4 flex flex-col items-center">
                      <div className="flex items-center justify-center w-12 h-6 bg-foreground/20 rounded-full cursor-not-allowed">
                        <div className="w-5 h-5 bg-foreground rounded-full translate-x-3" />
                      </div>
                    
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="mb-6 pb-6 border-b border-foreground/10">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-foreground mb-1 font-sans">
                        {t.analyticsTitle}
                      </h3>
                      <p className="text-sm text-foreground/60 leading-relaxed font-sans">
                        {t.analyticsDescription}
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleTogglePreference('analytics')}
                        className={`flex items-center justify-center w-12 h-6 rounded-full transition-colors cursor-pointer ${
                          preferences.analytics
                            ? 'bg-foreground'
                            : 'bg-foreground/20'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-background rounded-full transition-transform ${
                            preferences.analytics
                              ? 'translate-x-3'
                              : '-translate-x-3'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-foreground mb-1 font-sans">
                        {t.marketingTitle}
                      </h3>
                      <p className="text-sm text-foreground/60 leading-relaxed font-sans">
                        {t.marketingDescription}
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleTogglePreference('marketing')}
                        className={`flex items-center justify-center w-12 h-6 rounded-full transition-colors cursor-pointer ${
                          preferences.marketing
                            ? 'bg-foreground'
                            : 'bg-foreground/20'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-background rounded-full transition-transform ${
                            preferences.marketing
                              ? 'translate-x-3'
                              : '-translate-x-3'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-foreground/10 bg-foreground/5">
                <Button
                  onClick={closePreferences}
                  variant="outline"
                  size="sm"
                >
                  {t.cancel}
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  variant="primary"
                  size="sm"
                >
                  {t.savePreferences}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CookieConsent;
