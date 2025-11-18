'use client';

import { useIntro } from '@/context/IntroContext';
import { useEffect } from 'react';

export default function BodyWrapper({ children }: { children: React.ReactNode }) {
  const { isIntroActive } = useIntro();

  useEffect(() => {
    if (isIntroActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isIntroActive]);

  return <>{children}</>;
}
