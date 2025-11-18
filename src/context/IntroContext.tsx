'use client';

import { INTRO_PLAYED_COOKIE_KEY, INTRO_PLAYED_EXPIRY_DAYS } from '@/lib/constants';
import { createContext, ReactNode, useContext, useState } from 'react';

interface IntroContextType {
  isIntroActive: boolean;
  setIsIntroActive: (active: boolean) => void;
  markIntroAsPlayed: () => void;
}

const IntroContext = createContext<IntroContextType | undefined>(undefined);

// Cookie configuration
const INTRO_COOKIE_NAME = INTRO_PLAYED_COOKIE_KEY;
const INTRO_EXPIRY_DAYS = INTRO_PLAYED_EXPIRY_DAYS; // Replay intro after 7 days

// Helper function to set cookie client-side
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function IntroProvider({
  children,
  initialIntroPlayed = false
}: {
  children: ReactNode;
  initialIntroPlayed?: boolean;
}) {
  const [isIntroActive, setIsIntroActive] = useState(!initialIntroPlayed);

  // Mark intro as played and set cookie client-side
  const markIntroAsPlayed = () => {
    setIsIntroActive(false);
    setCookie(INTRO_COOKIE_NAME, 'true', INTRO_EXPIRY_DAYS);
  };

  return (
    <IntroContext.Provider value={{ isIntroActive, setIsIntroActive, markIntroAsPlayed }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (context === undefined) {
    throw new Error('useIntro must be used within an IntroProvider');
  }
  return context;
}
