'use client'
import { PAGE_TRANSITION_IN_DURATION, PAGE_TRANSITION_OUT_DURATION, PAGE_TRANSITION_PAUSE_DURATION } from "@/lib/constants";
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type PageTransitionContextType = {
  isTransitioning: boolean;
  isTransitioningIn: boolean;
  isTransitioningPause: boolean;
  isTransitioningRightBeforePause: boolean;
  isTransitioningOut: boolean;
  startTransition: (url: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTransitioningIn, setIsTransitioningIn] = useState(false);
  const [isTransitioningPause, setIsTransitioningPause] = useState(false);
  const [isTransitioningRightBeforePause, setIsTransitioningRightBeforePause] = useState(false);
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);
  const pendingRouteRef = useRef<string | null>(null);
  const router = useRouter();

  const startTransition = useCallback((url: string) => {
    pendingRouteRef.current = url;
    setIsTransitioning(true);
  }, []);

  useEffect(() => {
    const f = PAGE_TRANSITION_IN_DURATION - (PAGE_TRANSITION_IN_DURATION * 0.2)
    if (isTransitioning) {
      setIsTransitioningIn(true);
      setTimeout(() => {
        setIsTransitioningPause(true);
        setIsTransitioningIn(false);
        
        // Navigate to the pending route during the pause
        if (pendingRouteRef.current) {
          router.push(pendingRouteRef.current);
          pendingRouteRef.current = null;
        }
        
        setTimeout(() => {
          setIsTransitioningPause(false);
          setIsTransitioningRightBeforePause(false);
          setIsTransitioningOut(true);
          setTimeout(() => {
            setIsTransitioningOut(false);
            setIsTransitioning(false);
          }, PAGE_TRANSITION_OUT_DURATION);
        }, PAGE_TRANSITION_PAUSE_DURATION);
      }, PAGE_TRANSITION_IN_DURATION);

      setTimeout(() => {
        setIsTransitioningRightBeforePause(true);
      }, f);

    } else {
      // End transition animations
    }
  }, [isTransitioning, router]);

  return (
    <PageTransitionContext.Provider
      value={{
        isTransitioning,
        isTransitioningIn,
        isTransitioningPause,
        isTransitioningRightBeforePause,
        isTransitioningOut,
        startTransition,
      }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
};

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within a PageTransitionProvider");
  }
  return context;
}
