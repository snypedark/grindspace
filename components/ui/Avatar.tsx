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
                "font-bold select-none",
                sizes[size],
                className
            )}
            style={{
                background: src
                    ? "#E8EAF0"
                    : "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)",
                boxShadow: "4px 4px 10px #C5C8D6, -4px -4px 10px #FFFFFF",
                color: src ? undefined : "#FFFFFF",
            }}
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
