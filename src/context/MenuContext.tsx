'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { usePageTransition } from './PageTransitionContext';

interface MenuContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  toggleMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {  isTransitioningOut } = usePageTransition();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Close menu when page transition out starts
  useEffect(() => {
    if (isTransitioningOut) {
      setIsMenuOpen(false);
    }
  }, [isTransitioningOut]);

  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
