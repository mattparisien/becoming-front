'use client'
import { DemoComponentProps } from "./types";
import { useTheme } from "@/context/ThemeContext";

const SuperPodcastPlayer = ({ title, className, ...elseProps }: DemoComponentProps) => {
   const { palette } = useTheme();
    const additionalColors = palette?.additional || [];

    // Use title hash to deterministically select a color (consistent between server and client)
    const colorIndex = title ? title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % additionalColors.length + 1 : 0;
    const color = additionalColors[colorIndex];
    
    // Use title hash to deterministically select a color (consistent between server and client)

    return <div className={`w-full h-full flex items-center justify-center  ${className}`}  style={{
        backgroundColor: "#f2e7d2"
    }}>
        <div  {...elseProps} className="mx-auto w-[1050px]">

        </div>


    </div>
}

export default SuperPodcastPlayer;