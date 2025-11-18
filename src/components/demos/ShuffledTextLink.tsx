import classNames from "classnames";
import { DemoComponentProps } from "./types";

const ShuffledTextLink = ({ title, className }: DemoComponentProps) => {

    return <div className="w-full h-full bg-accent flex items-center justify-center">
        
            <a className={classNames("text-3xl md:text-5xl text-center", className)} href="#">{title}</a>
        
    </div>
}

export default ShuffledTextLink;