'use client';

import { useEffect, useState } from 'react';

interface ScrollPosition {
  scrollY: number;
  scrollX: number;
  scrollProgress: number;
  isAtBottom: boolean;
  isAtTop: boolean;
}

export function useScroll() {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    scrollY: 0,
    scrollX: 0,
    scrollProgress: 0,
    isAtBottom: false,
    isAtTop: true,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll progress (0 to 1)
      const scrollProgress = scrollY / (documentHeight - windowHeight);
      
      // Check if at bottom (with a small threshold of 10px)
      const isAtBottom = scrollY + windowHeight >= documentHeight - 10;
      
      // Check if at top
      const isAtTop = scrollY === 0;

      setScrollPosition({
        scrollY,
        scrollX,
        scrollProgress,
        isAtBottom,
        isAtTop,
      });
    };

    // Call once on mount to get initial position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollPosition;
}
