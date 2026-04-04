import { clsx } from "clsx";

interface ProgressBarProps {
    value: number; // 0–100
    label?: string;
    showValue?: boolean;
    size?: "sm" | "md";
    color?: "purple" | "green" | "orange" | "pink" | "blue";
    className?: string;
}

const GRADIENT_MAP: Record<string, string> = {
    purple: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)",
    green: "linear-gradient(135deg, #7EDCB5, #5EC8A0, #3DB889)",
    orange: "linear-gradient(135deg, #FFB88C, #F7A97C, #E8926A)",
    pink: "linear-gradient(135deg, #F5A0C0, #F07AAB, #E65A96)",
    blue: "linear-gradient(135deg, #88C8F7, #5EB0F0, #3A97E8)",
};

const GLOW_MAP: Record<string, string> = {
    purple: "0 0 8px rgba(125, 111, 247, 0.4)",
    green: "0 0 8px rgba(94, 200, 160, 0.4)",
    orange: "0 0 8px rgba(247, 169, 124, 0.4)",
    pink: "0 0 8px rgba(240, 122, 171, 0.4)",
    blue: "0 0 8px rgba(94, 176, 240, 0.4)",
};

export function ProgressBar({
    value,
    label,
    showValue = true,
    size = "md",
    color = "purple",
    className,
}: ProgressBarProps) {
    const clamped = Math.min(100, Math.max(0, value));

    return (
        <div className={clsx("w-full", className)}>
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-1.5">
                    {label && (
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE]">
                            {label}
                        </span>
                    )}
                    {showValue && (
                        <span className="text-xs font-semibold text-[#7B80A0]">{clamped}%</span>
                    )}
                </div>
            )}
            <div
                className={clsx(
                    "w-full bg-[#E8EAF0] rounded-full overflow-hidden",
                    size === "sm" ? "h-1.5" : "h-2.5"
                )}
                style={{
                    boxShadow: "inset 4px 4px 10px #C5C8D6, inset -4px -4px 10px #FFFFFF",
                }}
            >
                <div
                    className="h-full rounded-full transition-all duration-[1200ms] ease-smooth"
                    style={{
                        width: `${clamped}%`,
                        background: GRADIENT_MAP[color] || GRADIENT_MAP.purple,
                        boxShadow: GLOW_MAP[color] || GLOW_MAP.purple,
                    }}
                />
            </div>
        </div>
    );
}
