"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BarChart3,
    Trophy,
    Users,
    User,
    ChevronLeft,
    Zap,
} from "lucide-react";
import { clsx } from "clsx";
import { APP_NAME } from "@/constants/config";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
    { label: "Friends", href: "/friends", icon: Users },
    { label: "Profile", href: "/profile", icon: User },
];

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={clsx(
                "sticky top-0 h-screen z-30 flex flex-col bg-white border-r border-border shrink-0 overflow-hidden",
                "transition-all duration-300 ease-smooth",
                collapsed ? "w-[72px]" : "w-[240px]"
            )}
        >
            {/* Logo */}
            <div
                className={clsx(
                    "flex items-center h-16 px-4 border-b border-border gap-2.5 shrink-0 min-w-0 w-full",
                    collapsed && "justify-center"
                )}
            >
                <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-xl shrink-0">
                    <Zap className="w-4 h-4 text-white" />
                </div>
                {!collapsed && (
                    <span className="font-bold text-text-primary text-base tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {APP_NAME}
                    </span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto min-w-0 w-full">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium w-full min-w-0",
                                "transition-all duration-150 group relative",
                                isActive
                                    ? "bg-accent-light text-accent"
                                    : "text-text-secondary hover:bg-surface hover:text-text-primary",
                                collapsed && "justify-center"
                            )}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full" />
                            )}
                            <Icon
                                className={clsx(
                                    "w-4.5 h-4.5 shrink-0 transition-colors duration-150",
                                    isActive ? "text-accent" : "text-text-secondary group-hover:text-text-primary"
                                )}
                                size={18}
                            />
                            {!collapsed && (
                                <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0">
                                    {label}
                                </span>
                            )}
                            {/* Tooltip when collapsed */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-text-primary text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-sm">
                                    {label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse toggle */}
            <div className="px-2 py-3 border-t border-border shrink-0 min-w-0 w-full">
                <button
                    onClick={onToggle}
                    className={clsx(
                        "flex items-center justify-center w-full rounded-xl py-2 px-3 text-text-secondary min-w-0",
                        "hover:bg-surface hover:text-text-primary transition-all duration-150",
                        collapsed && "justify-center"
                    )}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <ChevronLeft
                        size={16}
                        className={clsx(
                            "shrink-0 transition-transform duration-300",
                            collapsed && "rotate-180"
                        )}
                    />
                    {!collapsed && (
                        <span className="text-xs ml-2 font-medium whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left min-w-0">
                            Collapse
                        </span>
                    )}
                </button>
            </div>
        </aside>
    );
}
