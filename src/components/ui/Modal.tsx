'use client';

import { Dialog } from "@headlessui/react";
import { ReactNode } from "react";
import Container from "../Container";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string | ReactNode;
    children: ReactNode;
    showCloseButton?: boolean;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};

const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    showCloseButton = true,
    maxWidth = 'sm',
    className = '',
}: ModalProps) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className="font-sans fixed inset-0 z-[999] flex items-center justify-center">
            <Container>
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <div className={`relative bg-background p-6 rounded-lg shadow-lg w-full ${maxWidthClasses[maxWidth]} mx-auto z-10 ${className}`}>
                    {/* Close button */}
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                            aria-label="Close modal"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}

                    {title && (
                        <Dialog.Title className="text-lg text-foreground font-semibold mb-4">
                            {title}
                        </Dialog.Title>
                    )}

                    {description && (
                        <Dialog.Description className="mb-4 text-sm text-foreground/70">
                            {description}
                        </Dialog.Description>
                    )}

                    {children}
                </div>
            </Container>
        </Dialog>
    );
};

export default Modal;
