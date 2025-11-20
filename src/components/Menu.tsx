'use client';

import { useIntro } from "@/context/IntroContext";
import { useMenu } from "@/context/MenuContext";
import classNames from "classnames";
import { useParams } from "next/navigation";
import { useRef } from "react";
import Container from "./Container";
import { CiGlobe } from "react-icons/ci";
import TransitionLayer from "./TransitionLayer";
import TransitionLink from "./TransitionLink";


interface MenuItem {
    title: string;
    slug: string;
}


interface MenuProps {
    items: MenuItem[];
    countryCode: string;
    onOpenLocationModal: () => void;
}

export default function Menu({ items, countryCode, onOpenLocationModal }: MenuProps) {

    const { isMenuOpen, toggleMenu } = useMenu();
    const { isIntroActive } = useIntro();
    const params = useParams();
    const pathname = params.slug;
    const containerRef = useRef<HTMLDivElement>(null);


    if (isIntroActive) return null;




    return (
        <div
            ref={containerRef}
            className={classNames('menu fixed inset-0 z-50', {
                'pointer-events-auto': isMenuOpen,
                'pointer-events-none': !isMenuOpen,
            })}
        >
            <div className="w-full h-full relative pt-header">
                <nav className={classNames("text-foreground-menu relative z-40 px-4 sm:px-6 lg:px-8 py-12 transition-opacity duration-300", {
                    'opacity-0': !isMenuOpen,
                    'delay-menu-nav-in': isMenuOpen,
                    'delay-menu-nav-out': !isMenuOpen,
                })} >
                    <ul className="space-y-3 flex flex-col">
                        {items.map((link, idx) => {
                            const isActive = pathname === link.slug;
                            return (
                                <li key={idx}>
                                    <NavLink
                                        link={link}
                                        isActive={isActive}
                                        toggleMenu={toggleMenu}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
            <TransitionLayer isActive={isMenuOpen} bgClassName="bg-background-menu" />
            <div className={classNames("w-full text-foreground-menu font-sans font-light absolute bottom-0 right-0 text-xl md:text-2xl", {
                'opacity-0 -translate-y-full': !isMenuOpen,
                'transition-all duration-500 ease-power2-out delay-[calc(var(--menu-delay)*1.3)]': isMenuOpen,
                'delay-none duration-100': !isMenuOpen,
            })}>
                <Container className="pb-4 w-full flex items-end justify-between">
                    <button
                        onClick={onOpenLocationModal}
                        className="md:hidden cursor-pointer flex items-center relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-current after:opacity-0 hover:after:opacity-100 transition-all duration-200"
                    >
                        <span className="flex items-center">
                            <CiGlobe />
                            <span className="ml-2 leading-none">{countryCode}</span>
                        </span>
                    </button>
                    <div>Montr&eacute;al, Canada</div>
                </Container>
            </div>
        </div>
    );
}

const NavLink = ({
    link,
    isActive,
    toggleMenu
}: {
    link: MenuItem;
    isActive: boolean;
    toggleMenu: () => void;
}) => {



    return <TransitionLink
        href={link.slug}
        onClick={toggleMenu}
        className={classNames(`font-light font-serif text-6xl sm:text-7xl leading-[1.2] hover:text-foreground-menu/70 transition-colors ${isActive ? 'underline decoration-2 underline-offset-8' : ''
            }`, {
            'char-anim-started': isActive
        })}
    >

        {link.title}
    </TransitionLink>
}
