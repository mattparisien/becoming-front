'use client';

import { usePageTransition } from '@/context/PageTransitionContext';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CSSProperties, MouseEvent, ReactNode, useEffect, useRef } from 'react';

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  style?: CSSProperties;
}

// Helper function to normalize URLs to absolute paths
function normalizeUrl(href: string | undefined | null | unknown): string {
  // Handle undefined, null, or empty string
  if (!href) {
    return '/';
  }

  // Ensure href is a string (convert if necessary)
  const hrefStr = typeof href === 'string' ? href : String(href);

  // If it's an external URL (http/https/mailto/tel), return as is
  if (hrefStr.startsWith('http://') || hrefStr.startsWith('https://') || hrefStr.startsWith('mailto:') || hrefStr.startsWith('tel:')) {
    return hrefStr;
  }

  // For all internal links, ensure they start with / to be treated as absolute paths from root
  // This prevents relative path issues when on nested routes like /products/something
  if (!hrefStr.startsWith('/')) {
    return `/${hrefStr}`;
  }

  return hrefStr;
}

export default function TransitionLink({ href, children, className, onClick, style }: TransitionLinkProps) {
  const { startTransition, isTransitioningPause } = usePageTransition();
  const params = useParams();
  const pathname = params?.slug;

  const shouldScrollRef = useRef(false);

  // Normalize the href to ensure it's always an absolute path
  const normalizedHref = normalizeUrl(href);

  const isCurrentPage = normalizedHref === pathname || (normalizedHref === '/' && pathname === '/');


  // Scroll to top when transitioning pause starts
  useEffect(() => {
    if (isTransitioningPause && shouldScrollRef.current) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      shouldScrollRef.current = false;
    }
  }, [isTransitioningPause]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Don't transition if clicking on the current page
    if (isCurrentPage) {
      if (onClick) {
        onClick();
      }
      return;
    }

    if (onClick) {
      onClick();
    }

    // Mark that we should scroll when pause starts
    shouldScrollRef.current = true;

    // Always use the normalized href for navigation
    startTransition(normalizedHref);
  };

  return (
    <Link 
      href={normalizedHref} 
      onClick={handleClick} 
      className={className} 
      style={style}
      prefetch={true}
    >
      {children}
    </Link>
  );
}
