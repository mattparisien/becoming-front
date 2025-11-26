'use client'
import { useTheme } from "@/context/ThemeContext";
import classNames from "classnames";
import { DemoComponentProps } from "./types";


const ShuffledTextLink = ({ title, className }: DemoComponentProps) => {

    const { palette } = useTheme();
    const additionalColors = palette?.additional || [];

    // Use title hash to deterministically select a color (consistent between server and client)
    const colorIndex = title ? title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % additionalColors.length : 0;
    const color = additionalColors[colorIndex];

    return <div className="w-full h-full flex items-center justify-center" style={{
        backgroundColor: color?.value
    }}>


        <a className={classNames("text-3xl md:text-5xl text-center text-foreground", className)} href="#">{title}</a>

    </div>
}

export default ShuffledTextLink;