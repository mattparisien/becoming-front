'use client';

import { useEffect, useState } from 'react';

interface MainProps {
    children: React.ReactNode;
}

const Main = ({ children }: MainProps) => {
    const [footerHeight, setFooterHeight] = useState(0);

    useEffect(() => {
        const updateFooterHeight = () => {
            const footer = document.getElementById('footer');
            if (footer) {
                setFooterHeight(footer.offsetHeight);
            }
        };

        // Initial calculation
        updateFooterHeight();

        // Update on resize
        window.addEventListener('resize', updateFooterHeight);

        // Cleanup
        return () => {
            window.removeEventListener('resize', updateFooterHeight);
        };
    }, []);

    return (
        <main
            className="min-h-screen-minus-header bg-bg pt-header sticky z-30 pointer-events-none [&>*]:pointer-events-auto [&>*]:bg-background"
            style={{ paddingBottom: `calc(${footerHeight}px - var(--main-footer-offset))` }}
        >
            {children}
        </main >
    );
}

export default Main;