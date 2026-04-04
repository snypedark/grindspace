"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === overlayRef.current && onClose()}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" />

            {/* Panel */}
            <div
                className={clsx(
                    "relative z-10 bg-white rounded-2xl shadow-card-hover border border-border",
                    "w-full max-w-md p-6 animate-fade-slide-up",
                    className
                )}
            >
                <div className="flex items-center justify-between mb-4">
                    {title && (
                        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="ml-auto -mr-1 !p-1.5"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                {children}
            </div>
        </div>
    );
}
