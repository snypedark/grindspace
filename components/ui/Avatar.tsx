import { clsx } from "clsx";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
    src?: string | null;
    name?: string;
    size?: AvatarSize;
    className?: string;
}

const sizes: Record<AvatarSize, string> = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
};

function getInitials(name?: string) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
    return (
        <div
            className={clsx(
                "relative flex items-center justify-center rounded-full overflow-hidden shrink-0",
                "bg-accent-light text-accent font-semibold select-none",
                sizes[size],
                className
            )}
        >
            {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={name ?? "Avatar"}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span>{getInitials(name)}</span>
            )}
        </div>
    );
}
