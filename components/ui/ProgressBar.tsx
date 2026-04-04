import { clsx } from "clsx";

interface ProgressBarProps {
    value: number; // 0–100
    label?: string;
    showValue?: boolean;
    size?: "sm" | "md";
    className?: string;
}

export function ProgressBar({
    value,
    label,
    showValue = true,
    size = "md",
    className,
}: ProgressBarProps) {
    const clamped = Math.min(100, Math.max(0, value));

    return (
        <div className={clsx("w-full", className)}>
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-1.5">
                    {label && (
                        <span className="text-xs font-medium text-text-primary">{label}</span>
                    )}
                    {showValue && (
                        <span className="text-xs text-text-secondary">{clamped}%</span>
                    )}
                </div>
            )}
            <div
                className={clsx(
                    "w-full bg-gray-100 rounded-full overflow-hidden",
                    size === "sm" ? "h-1.5" : "h-2"
                )}
            >
                <div
                    className="bg-accent rounded-full transition-all duration-700 ease-smooth"
                    style={{ width: `${clamped}%` }}
                />
            </div>
        </div>
    );
}
