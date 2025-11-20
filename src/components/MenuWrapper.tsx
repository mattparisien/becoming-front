'use client'

import { useLocationModal } from "@/context/LocationModalContext";
import Menu from "./Menu";

interface MenuItem {
    title: string;
    slug: string;
}

interface MenuWrapperProps {
    items: MenuItem[];
    countryCode: string;
}

export default function MenuWrapper({ items, countryCode }: MenuWrapperProps) {
    const { open: openLocationModal } = useLocationModal();
    
    return <Menu items={items} countryCode={countryCode} onOpenLocationModal={openLocationModal} />;
}
