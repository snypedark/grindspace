import { clsx } from "clsx";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-[22px]",
    lg: "p-6",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ hover = true, padding = "md", className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={clsx(
                    "bg-[#E8EAF0] rounded-[18px] shadow-neu",
                    "transition-all duration-220 ease-smooth",
                    hover && "hover:-translate-y-0.5 hover:shadow-neu-hover cursor-pointer",
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
