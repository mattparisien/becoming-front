'use client';

import { useEffect } from 'react';

interface CSSVariablesInjectorProps {
  variables: {
    '--page-transition-in-duration'?: string;
    '--page-transition-out-duration'?: string;
    '--page-transition-pause-duration'?: string;
    '--page-transition-ease'?: string;
    '--fg-color'?: string;
    '--bg-color'?: string;
    '--accent-color'?: string;
    '--fg-color-menu'?: string;
    '--bg-color-menu'?: string;
    '--accent-color-menu'?: string;
  };
}

export default function CSSVariablesInjector({ variables }: CSSVariablesInjectorProps) {
  useEffect(() => {
    const root = document.documentElement;
    
    Object.entries(variables).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        root.style.setProperty(key, value);
      }
    });
  }, [variables]);

  return null;
}
