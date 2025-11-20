'use client'
import { useIntro } from "@/context/IntroContext";
import { useMenu } from "@/context/MenuContext";
import { useSplitText } from "@/hooks/useSplitText";
import { getHeaderTranslations } from "@/lib/i18n/translations";
import { useCartStore } from "@/store/cartStore";
import classNames from "classnames";
import gsap from "gsap";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CartDrawer from "./CartDrawer";
import Container from "./Container";
import Logo from "./Logo";
import TransitionLink from "./TransitionLink";
import { CiGlobe } from "react-icons/ci";
import { useLocationModal } from "@/context/LocationModalContext";
import { useCartDrawer } from "@/context/CartDrawerContext";


interface HeaderProps {
  title: string;
  countryCode: string;
  initialCartCount: number;
}

const Header = ({ title, countryCode, initialCartCount }: HeaderProps) => {

  const params = useParams();
  const locale = (params?.lang as string) || 'en'; // Fallback to 'en' if no locale
  const t = getHeaderTranslations(locale);

  const { isIntroActive } = useIntro();
  const { isMenuOpen, toggleMenu } = useMenu();
  const { open: openLocationModal } = useLocationModal();
  const { isOpen: isCartOpen, open: openCartDrawer, close: closeCartDrawer } = useCartDrawer();
  
  // Use server-rendered count initially, then sync with store
  const [cartCount, setCartCount] = useState(initialCartCount);
  const storeCartCount = useCartStore((state) => state.getTotalItems());
  const hasIntroCompletedRef = useRef(false);

  // Sync with store after hydration
  useEffect(() => {
    setCartCount(storeCartCount);
  }, [storeCartCount]);

  const { chars } = useSplitText({
    elementId: 'header-logo',
    type: 'words,chars',
    isDisabled: !isIntroActive,
  });

  useEffect(() => {
    const logo = document.getElementById('header-logo');
    if (!logo) return;

    // If intro is not active, show the logo immediately
    if (!isIntroActive) {
      gsap.set(logo, { visibility: 'visible' });
      return;
    }

    // Otherwise, show logo once chars are split (for intro animation)
    if (chars.length > 0) {
      gsap.set(logo, { visibility: 'visible' });
    }
  }, [chars, isIntroActive]);

  useEffect(() => {
    // Track when intro completes
    if (!isIntroActive && !hasIntroCompletedRef.current) {
      hasIntroCompletedRef.current = true;
    }
  }, [isIntroActive]);


  const durationClass = 'duration-200';

  return (
    <>
      <header id="site-header" className={classNames(`fixed h-header z-60 flex items-center justify-center top-0 left-0 w-full transition-colors`, {
        'bg-background': !isMenuOpen,
        'delay-400': !isMenuOpen
      })}>
        <Container className="w-full">
          <div className={"flex items-center justify-between w-full relative transitionn-opacity duration-200"}>
            <div></div>

            <div className="flex items-center absolute left-0 md:left-1/2 top-1/2 transform md:-translate-x-1/2 -translate-y-1/2">
              <TransitionLink href="/" className="flex items-center space-x-3">
                <Logo
                  text={title}
                  className={classNames("overflow-hidden text-3xl sm:text-4xl flex leading-[0.8]", {
                    'transition-colors': !isIntroActive,
                    'text-background': isMenuOpen,
                    'text-foreground': !isMenuOpen,
                    'delay-300': !isMenuOpen && !isIntroActive,
                    "invisible": isIntroActive,
                    [durationClass]: !isIntroActive,
                  })}
                  id="header-logo"
                />
              </TransitionLink>
            </div>

            {!isIntroActive && (
              <div className="flex gap-x-3 sm:gap-x-4 lg:gap-x-6 text-xl lg:text-2xl transition-opacity duration-300">
                <button
                  onClick={openLocationModal}
                  className={classNames(`cursor-pointer hidden md:flex items-center relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-current after:opacity-0 hover:after:opacity-100`,
                    durationClass,
                    {
                      'text-background': isMenuOpen,
                      'delay-300': !isMenuOpen,
                    })}
                >
                  <span className="flex items-center">
                    <CiGlobe />
                    <span className="ml-2 leading-none">{countryCode}</span>
                  </span>
                </button>
                <button
                  onClick={toggleMenu}
                  className={classNames(`font-sans z-50 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-current after:opacity-0 hover:after:opacity-100`,
                    durationClass,
                    {
                      'text-background': isMenuOpen,
                      'text-foreground': !isMenuOpen,
                      'delay-300': !isMenuOpen,
                    })}
                >
                  {isMenuOpen ? t.close : t.menu}
                </button>
                <button
                  className={classNames(`font-sans z-50 cursor-pointer duration-300 overflow-hidden relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-current after:opacity-0 hover:after:opacity-100`,
                    durationClass,
                    {
                      'text-background': isMenuOpen,
                      'text-foreground': !isMenuOpen,
                      'delay-300': !isMenuOpen,
                    })}
                  onClick={openCartDrawer}
                >
                  <span className={classNames("font-sans inline-block transition-transform duration-100", {
                  })}>
                    {t.cart} {`(${cartCount})`}
                  </span>
                </button>
              </div>
            )}

          </div>
        </Container>
      </header >

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCartDrawer} />
    </>
  );
};

Header.displayName = 'Header';

export default Header;
