'use client';

import Container from "@/components/Container";
import { DemoComponentProps } from "@/components/demos/types";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { useState, useMemo } from "react";
import { isMobile, isTablet } from "@/lib/helpers/deviceDetection";
import MobileWarningModal from "@/components/MobileWarningModal";

interface DemoComponentManagerProps {
    title: string;
    slug: string;
    pluginJSON?: string;
}

const demoComponentRegistry: { [key: string]: React.ComponentType<DemoComponentProps> } = {
    'magnetic-button': dynamic(() => import('@/components/demos/MagneticButton')),
    'shuffled-text-link': dynamic(() => import('@/components/demos/ShuffledTextLink')),
    'mouse-follower': dynamic(() => import('@/components/demos/MouseFollower')),
};

export default function DemoComponentManager({ title, slug, pluginJSON }: DemoComponentManagerProps) {
    const shouldShowWarning = useMemo(() => {
        if (!pluginJSON || typeof window === 'undefined') return false;
        
        const { supportedPlatforms } = JSON.parse(pluginJSON);
        return (!supportedPlatforms.includes("mobile") && isMobile()) || 
               (!supportedPlatforms.includes("tablet") && isTablet());
    }, [pluginJSON]);

    const [showMobileWarning, setShowMobileWarning] = useState<boolean>(shouldShowWarning);

    if (!pluginJSON) return notFound();

    const { treeConfig } = JSON.parse(pluginJSON);


    const DemoComponent = demoComponentRegistry[slug];


    const className = typeof treeConfig === "string" && treeConfig.includes(",.")
        ? treeConfig.split(",").map(x => x.replace(".", " ")).join(" ")
        : undefined;
    const isComponentNeeded = true;


    if (!DemoComponent && isComponentNeeded) return notFound();


    return (
        <section className="flex items-center justify-center">
            {/* Mobile/Tablet Warning Popup */}
            <MobileWarningModal
                isOpen={showMobileWarning}
                onClose={() => setShowMobileWarning(false)}
            />

            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.Static = window.Static || {};
                        window.Static.SQUARESPACE_CONTEXT = {
                            website: {
                                id: "demo-site",
                                identifier: "demo",
                                baseUrl: window.location.origin,
                                internalUrl: window.location.origin,
                            },
                            pageType: 1
                        };
                    `
                }}
            />
            <script src={`${process.env.PLUGIN_BUNDLE_URL}/${slug}/bundle.js`} defer></script>
            <link rel="stylesheet" href={`${process.env.PLUGIN_BUNDLE_URL}/${slug}/assets/styles/main.css`} />
            <Container className="w-full py-5">
                <div className="w-full h-[calc(var(--screen-minus-header-height)-theme(space.20))] rounded-xl overflow-hidden">
                    {isComponentNeeded && <DemoComponent className={className} title={title} />}
                </div>
            </Container>
        </section>
    );

}