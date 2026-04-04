"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";

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
            <div className="absolute inset-0 bg-[#3B3F5C]/20 backdrop-blur-sm animate-fade-in" />

            {/* Panel */}
            <div
                className={clsx(
                    "relative z-10 bg-[#E8EAF0] rounded-[24px]",
                    "shadow-neu-lg",
                    "w-full max-w-md p-6 animate-fade-slide-up",
                    className
                )}
            >
                <div className="flex items-center justify-between mb-5">
                    {title && (
                        <h2 className="text-base font-bold text-[#3B3F5C]">{title}</h2>
                    )}
                    <button
                        onClick={onClose}
                        className="ml-auto flex items-center justify-center w-8 h-8 rounded-[10px] bg-[#E8EAF0] shadow-neu-sm hover:shadow-neu-inset transition-all duration-200 text-[#7B80A0] hover:text-[#3B3F5C]"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
