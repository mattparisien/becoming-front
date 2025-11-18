"use client"
import { usePageTransition } from "@/context/PageTransitionContext";
import classNames from "classnames";
import Logo from "./Logo";
import TransitionLayer from "./TransitionLayer";
import { useSplitText } from "@/hooks/useSplitText";
import { useEffect } from "react";
import gsap from "gsap";

interface PageTransitionScreenProps {
    text: string;
}

const PageTransitionScreen = ({text}: PageTransitionScreenProps) => {
    const { isTransitioning, isTransitioningIn, isTransitioningRightBeforePause, isTransitioningPause } = usePageTransition();
    const { chars } = useSplitText({
        elementId: 'page-transition-logo',
        type: 'lines,words,chars',
    });

    useEffect(() => {
        if (chars.length > 0 && isTransitioningRightBeforePause) {
            gsap.timeline().to(chars, {
                y: 0,
                duration: 0.8,
                stagger: 0.024,
                ease: "elastic.out(1, 0.5)",
            })
            .to(chars, {
                y: '-100%',
                ease: 'expo.inOut',
                stagger: 0.02,
                duration: 0.8,
                delay: 0.1
            })
        }
    }, [chars, isTransitioningRightBeforePause]);

    useEffect(() => {
        // Reset chars position when transition starts
        if (isTransitioningIn && chars.length > 0) {
            gsap.set(chars, { y: "100%" });
        }
    }, [isTransitioningIn, chars]);

    return <TransitionLayer isActive={isTransitioningIn || isTransitioningPause} className={classNames("z-70", {
        "invisible": !isTransitioning,
    })} >

        <Logo text={text} className={classNames("text-background text-[12vw] md:text-[8vw] whitespace-nowrap absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-opacity duration-200 [&_.char]:translate-y-full", {
            "invisible": !isTransitioning
        })} id="page-transition-logo" />
    </TransitionLayer>
}

export default PageTransitionScreen;