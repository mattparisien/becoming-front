'use client'
import { useTheme } from "@/context/ThemeContext";
import { getRandomArrayValue } from "@/lib/helpers/utils";
import classNames from "classnames";
import { DemoComponentProps } from "./types";

const MouseFollower = ({ title, className }: DemoComponentProps) => {

    const { palette } = useTheme();
    const color = getRandomArrayValue(palette?.additional || []);

    return <div className="w-full h-full bg-accent flex items-center justify-center" style={{
        backgroundColor: color?.value
    }}>
        <div className={classNames(className)}>

        </div>
    </div>
}

export default MouseFollower;