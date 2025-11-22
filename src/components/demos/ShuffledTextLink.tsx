'use client'
import classNames from "classnames";
import { DemoComponentProps } from "./types";
import { useTheme } from "@/context/ThemeContext";
import { getRandomArrayValue } from "@/lib/helpers/utils";
import AnimatedBlob from "../AnimatedBlob";


const ShuffledTextLink = ({ title, className }: DemoComponentProps) => {

    const { palette } = useTheme();
    const additionalColors = palette?.additional || [];

    const color = getRandomArrayValue(additionalColors);

    return <div className="w-full h-full flex items-center justify-center" style={{
        backgroundColor: color?.value
    }}>
        
            <AnimatedBlob color={color.value}/>
        
        <a className={classNames("text-3xl md:text-5xl text-center text-foreground", className)} href="#">{title}</a>

    </div>
}

export default ShuffledTextLink;