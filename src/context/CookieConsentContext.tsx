'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface CookieConsentContextType {
  showPreferences: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [showPreferences, setShowPreferences] = useState(false);

  const openPreferences = () => setShowPreferences(true);
  const closePreferences = () => setShowPreferences(false);

  return (
    <CookieConsentContext.Provider value={{ showPreferences, openPreferences, closePreferences }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
