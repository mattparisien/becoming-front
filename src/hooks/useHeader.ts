'use client';

import { useState, useEffect } from 'react';

export function useHeader() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.getElementById('site-header');
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    // Initial measurement
    updateHeaderHeight();

    // Update on resize
    window.addEventListener('resize', updateHeaderHeight);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  return { headerHeight };
}
