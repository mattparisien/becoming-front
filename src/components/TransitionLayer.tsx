'use client';
import classNames from "classnames";


interface TransitionLayerProps {
    className?: string;
    bgClassName?: string;
    isActive?: boolean;
    children?: React.ReactNode;
}


const TransitionLayer = ({ className, isActive, children, bgClassName }: TransitionLayerProps) => {

    return <div className={classNames('pointer-events-none fixed left-0 top-0 w-screen h-screen', {
        [className as string]: className
    })}>
        <div className="relative w-full h-full">
            {children}
            <div className={classNames("origin-top ease-[var(--page-transition-ease)] duration-[var(--page-transition-in-duration)] w-full h-full", {
                'scale-y-0': !isActive,
                "bg-accent": !bgClassName,
                [bgClassName as string]: bgClassName,

            })}></div>

        </div>
    </div>
}

export default TransitionLayer;