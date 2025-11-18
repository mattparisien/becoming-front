import { DemoComponentProps } from "./types";
import Button from "../ui/Button";
import classNames from "classnames";

const MagneticButton = ({ title, className }: DemoComponentProps) => {

    return <div className="w-full h-full bg-accent flex items-center justify-center">
        <div className={classNames(className)}>
            <Button size="lg" className={classNames("font-serif !text-4xl !font-normal")}>{title}</Button>
        </div>
    </div>
}

export default MagneticButton;