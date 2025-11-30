import Image from "next/image";
import type { Plugin } from "@/lib/types/plugin";

interface PluginCardProps {
  plugin: Plugin;
}

export default function PluginCard({ plugin }: PluginCardProps) {
  
  const getHeightClass = () => {
    // Variable heights for mosaic effect
    const heights = {
      small: "h-[280px]",
      medium: "h-[360px]",
      large: "h-[440px]"
    };

    return heights[plugin.size];
  };

  return (
    <div
      className={`
        relative group overflow-hidden rounded-xl border border-black/[.08] dark:border-white/[.145]
        bg-white dark:bg-black/[.05] hover:border-black/[.15] dark:hover:border-white/[.25]
        transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
        ${getHeightClass()}
        w-full
      `}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-foreground/10">
        <Image
          src={plugin.image}
          alt={plugin.name}
          fill
          className="object-cover opacity-10 group-hover:opacity-20 transition-opacity"
        />
      </div>

      {/* Content */}
            {/* Content */}
      <div className="relative h-full p-5 md:p-6 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-4">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-foreground/10 text-foreground uppercase tracking-wide">
              {plugin.category}
            </span>
            {plugin.featured && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-foreground text-background uppercase tracking-wide">
                Featured
              </span>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-foreground/80 transition-colors leading-tight">
            {plugin.name}
          </h3>
          <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
            {plugin.description}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-black/[.08] dark:border-white/[.145]">
          <span className="text-2xl md:text-3xl font-bold text-foreground">
            ${plugin.price}
          </span>
          <button className="px-5 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all text-sm font-semibold whitespace-nowrap shadow-sm hover:shadow-md">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
