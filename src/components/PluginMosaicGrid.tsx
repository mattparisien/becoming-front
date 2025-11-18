import PluginCard from "./PluginCard";
import type { Plugin } from "@/lib/types/plugin";

interface PluginMosaicGridProps {
  plugins: Plugin[];
}

export default function PluginMosaicGrid({ plugins }: PluginMosaicGridProps) {
  return (
    <div className="w-full">
      {/* Grid Container - Mobile stacks, Desktop shows max 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plugins.map((plugin, idx) => (
          <PluginCard key={idx} plugin={plugin} />
        ))}
      </div>
    </div>
  );
}
