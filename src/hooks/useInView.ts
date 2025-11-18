'use client';

import { useEffect, useState, RefObject } from 'react';

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView(
  ref: RefObject<Element | null>,
  options: UseInViewOptions = {}
) {
  const { threshold = 0, rootMargin = '0px', triggerOnce = false } = options;
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If triggerOnce is true and element has already been in view, don't observe
    if (triggerOnce && hasBeenInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);

        if (inView && !hasBeenInView) {
          setHasBeenInView(true);
        }

        // If triggerOnce is true and element is in view, disconnect observer
        if (triggerOnce && inView) {
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, triggerOnce, hasBeenInView]);

  return { isInView, hasBeenInView };
}
