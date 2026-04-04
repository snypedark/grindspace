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
        "bg-accent text-white border-transparent shadow-[0_1px_2px_rgba(99,102,241,0.2)] hover:bg-accent-hover hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)]",
    secondary:
        "bg-white text-text-primary border-border shadow-card hover:shadow-card-hover hover:bg-surface",
    ghost:
        "bg-transparent text-text-secondary border-transparent hover:bg-surface hover:text-text-primary",
};

const sizeStyles: Record<Size, string> = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={clsx(
                    "inline-flex items-center justify-center font-medium rounded-xl border",
                    "transition-all duration-200 ease-smooth cursor-pointer",
                    "active:scale-95 hover:scale-[1.02]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
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
