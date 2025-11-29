'use client'
import { DemoComponentProps } from "./types";


const SuperPodcastPlayer = ({ title, className, ...elseProps }: DemoComponentProps) => {

    
    // Use title hash to deterministically select a color (consistent between server and client)

    return <div className={`w-full h-full flex items-center justify-center max-w-[950px] mx-auto pt-10 ${className}`} {...elseProps}>



    </div>
}

export default SuperPodcastPlayer;