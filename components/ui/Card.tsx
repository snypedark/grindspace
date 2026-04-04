import { clsx } from "clsx";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ hover = true, padding = "md", className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    "bg-white border border-border rounded-2xl shadow-card",
                    "transition-all duration-200 ease-smooth",
                    hover && "hover:-translate-y-1 hover:shadow-card-hover cursor-pointer",
                    paddingStyles[padding],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";
