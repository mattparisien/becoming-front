'use client';

import { createContext, useContext, ReactNode } from 'react';

interface ColorValue {
  name: string;
  value: string;
}

interface Palette {
  bg: ColorValue;
  fg: ColorValue;
  accent: ColorValue;
  additional: ColorValue[];
}

interface ThemeContextType {
  palette: Palette | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  palette: Palette | null;
}

export function ThemeProvider({ children, palette }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ palette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
