'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
    href: string;
    label: string;
    onClick?: () => void;
}

export default function NavLink({ href, label, onClick }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`font-sans text-6xl md:text-6xl hover:text-foreground-menu/70 transition-colors ${
                isActive ? 'underline decoration-2 underline-offset-8' : ''
            }`}
        >
            {label}
        </Link>
    );
}
