'use client';

import PluginLinkItem from "./PluginLinkItem";
import { useIntro } from "@/context/IntroContext";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";

export interface MasonryGridItem {
  id: number | string;
  image: {
    src: string;
    alt: string;

  },
  slug: string;
  title: string;
  subtitle: string;
}

interface MasonryGridProps {
  items: MasonryGridItem[]
}

export default function MasonryGrid({ items }: MasonryGridProps) {
  const { isIntroActive } = useIntro();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    // On mount, check if intro is already inactive
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      if (!isIntroActive) {
        setShouldAnimate(true);
      }
      return;
    }

    // After mount, animate when intro becomes inactive
    if (!isIntroActive && !shouldAnimate) {
      setShouldAnimate(true);
    }
  }, [isIntroActive, shouldAnimate]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-5">
      {items.map((item, index) => (
        <PluginLinkItem
          key={index}
          {...item}
          className={classNames("grid-item opacity-0", {
            "animate-fade-in-up": shouldAnimate,
          })}
          style={{
            animationDelay: shouldAnimate ? `${index * 150}ms` : undefined,
          }}
        />
      ))}
    </div>
  );
}
