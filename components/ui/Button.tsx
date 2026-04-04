import { clsx } from "clsx";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
}

const variantStyles: Record<Variant, string> = {
    primary:
        "bg-gradient-to-br from-[#9D93F9] via-[#7C6FF7] to-[#5B51E0] text-white shadow-neu-accent hover:shadow-[6px_6px_18px_rgba(92,81,224,0.45),-3px_-3px_8px_rgba(255,255,255,0.7)]",
    secondary:
        "bg-[#E8EAF0] text-[#3B3F5C] shadow-neu hover:shadow-neu-hover active:shadow-neu-inset",
    ghost:
        "bg-[#E8EAF0] text-[#7B80A0] shadow-neu-sm hover:shadow-neu hover:text-[#3B3F5C] active:shadow-neu-inset",
};

const sizeStyles: Record<Size, string> = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    "inline-flex items-center justify-center font-bold rounded-xl",
                    "transition-all duration-220 ease-smooth cursor-pointer",
                    "hover:scale-[1.02] hover:-translate-y-0.5",
                    "active:scale-[0.98] active:translate-y-0",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C6FF7] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E8EAF0]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0",
                    variantStyles[variant],
                    sizeStyles[size],
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";
