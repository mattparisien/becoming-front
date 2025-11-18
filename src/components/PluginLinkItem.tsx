import TransitionLink from "./TransitionLink";
import { MasonryGridItem } from "./MasonryGrid";
import { CSSProperties } from "react";
import Image from "next/image";

interface PluginLinkItemProps extends MasonryGridItem {
  className?: string;
  style?: CSSProperties;
}

export default function PluginLinkItem({ image, slug, title, subtitle, className = "", style }: PluginLinkItemProps) {
  return (
    <TransitionLink href={slug} className={`group cursor-pointer ${className}`} style={style}>
      <figure>
        <div className="overflow-hidden rounded-2xl transition-transform duration-400 ease-in-out group-hover:scale-[0.94] aspect-3/2">
          <Image
            src={image.src}
            alt={image.alt}
            width={800}
            height={533}
            className="h-full w-full object-cover transition-transform duration-400 ease-in-out group-hover:scale-[1.2]"
          />
        </div>

        <figcaption className="text-xl sm:text-2xl xl:text-3xl mt-3 flex items-start justify-between group/caption">
          <span className="font-serif text-foreground group-hover/caption:underline">{title}</span>
          <span className="font-sans text-foreground group-hover/caption:underline">${subtitle}</span>
        </figcaption>
      </figure>
    </TransitionLink>
  );
}
