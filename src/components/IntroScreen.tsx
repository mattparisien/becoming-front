'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useIntro } from '@/context/IntroContext';
import { useSplitText } from '@/hooks/useSplitText';

const IntroScreen = () => {
    const { markIntroAsPlayed } = useIntro();
    const { chars } = useSplitText({
        elementId: 'header-logo',
        type: 'words,chars',
    });

    const hasAnimatedRef = useRef(false);


    useEffect(() => {

        if (!chars || chars.length === 0) return;

        if (hasAnimatedRef.current) return;

        const logo = document.getElementById('header-logo');
        if (!logo) return;

        // Get logo's current position
        const logoRect = logo.getBoundingClientRect();

        // Calculate center of window
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Calculate current center of logo
        const logoCenterX = logoRect.left + logoRect.width / 2;
        const logoCenterY = logoRect.top + logoRect.height / 2;

        // Calculate translation needed to center
        const translateX = centerX - logoCenterX;
        const translateY = centerY - logoCenterY;
        const scale = window.innerWidth / logoRect.width * 0.8;

        // Set initial state: centered and scaled
        gsap.set(logo, {
            x: translateX,
            y: translateY,
            scale,
            transformOrigin: 'center center'
        });

        const charTl = (chars: Element[]) => {

            const left = chars.slice(0, Math.floor(chars.length / 2));
            const right = chars.slice(Math.floor(chars.length / 2));
            const stagger = 0.2;

            const leftTl = gsap.timeline().from(left, {
                y: '100%',
                duration: 1,
                ease: 'expo.inOut',
                stagger,
                delay: 0.1,
            });

            const rightTl = gsap.timeline().from(right.reverse(), {
                y: '100%',
                duration: 1,
                ease: 'expo.inOut',
                stagger,
            });

            return gsap.timeline().add(leftTl, 0).add(rightTl, 0);
        }

        const logoTl = () => {
            return gsap.timeline()
                .to(logo, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.9,
                    ease: 'expo.inOut',
                    onStart: () => {
                        // Remove char-anim class before scaling back to prevent retrigger
                        logo.classList.remove('char-anim');
                    },
                    onComplete: () => {
                        markIntroAsPlayed();
                    }
                });
        }

        const masterTl = () => {
            return gsap.timeline()
                .add(charTl(chars), 0)
                .add(logoTl());
        }

        masterTl();



        hasAnimatedRef.current = true;


    }, [markIntroAsPlayed, chars])

    return (
        <div
            className="z-50 w-screen h-screen fixed top-0 left-0 -z-10 flex items-center justify-center pointer-events-none bg-background"
        >
            <div className="w-full h-full relative">

            </div>
        </div>
    )
}

export default IntroScreen;