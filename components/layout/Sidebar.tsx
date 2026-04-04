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
                "sticky top-0 h-screen z-30 flex flex-col bg-[#E8EAF0] shrink-0 overflow-hidden",
                "transition-all duration-[380ms] ease-smooth",
                "rounded-r-[24px]",
                collapsed ? "w-[72px]" : "w-[220px]"
            )}
            style={{
                boxShadow: "6px 0 20px #C5C8D6",
            }}
        >
            {/* Logo */}
            <div
                className={clsx(
                    "flex items-center h-16 px-4 gap-2.5 shrink-0 min-w-0 w-full",
                    collapsed && "justify-center"
                )}
            >
                <div
                    className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                    style={{
                        background: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)",
                        boxShadow: "4px 4px 10px rgba(92,81,224,0.3), -2px -2px 6px rgba(255,255,255,0.6)",
                    }}
                >
                    <Zap className="w-4 h-4 text-white" />
                </div>
                {!collapsed && (
                    <span className="font-[900] text-[#3B3F5C] text-base tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                        {APP_NAME}
                    </span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-2.5 py-4 space-y-2 overflow-y-auto min-w-0 w-full">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold w-full min-w-0",
                                "transition-all duration-200 group relative",
                                collapsed && "justify-center"
                            )}
                        >
                            {/* Icon container — neumorphic square */}
                            <div
                                className={clsx(
                                    "flex items-center justify-center w-9 h-9 rounded-[10px] shrink-0 transition-all duration-200",
                                )}
                                style={
                                    isActive
                                        ? {
                                              background: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)",
                                              boxShadow: "4px 4px 10px rgba(92,81,224,0.3), -2px -2px 6px rgba(255,255,255,0.6)",
                                          }
                                        : {
                                              background: "#E8EAF0",
                                              boxShadow: "4px 4px 10px #C5C8D6, -4px -4px 10px #FFFFFF",
                                          }
                                }
                            >
                                <Icon
                                    size={18}
                                    className={clsx(
                                        "shrink-0",
                                        isActive ? "text-white" : "text-[#7B80A0] group-hover:text-[#3B3F5C]"
                                    )}
                                />
                            </div>
                            {!collapsed && (
                                <span
                                    className={clsx(
                                        "whitespace-nowrap overflow-hidden text-ellipsis flex-1 min-w-0",
                                        isActive ? "text-[#3B3F5C]" : "text-[#7B80A0] group-hover:text-[#3B3F5C]"
                                    )}
                                >
                                    {label}
                                </span>
                            )}
                            {/* Tooltip when collapsed */}
                            {collapsed && (
                                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#E8EAF0] shadow-neu-sm text-[#3B3F5C] text-xs font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
                                    {label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse toggle */}
            <div className="px-2.5 py-3 shrink-0 min-w-0 w-full">
                <button
                    onClick={onToggle}
                    className={clsx(
                        "flex items-center justify-center w-full rounded-xl py-2 px-3 min-w-0",
                        "bg-[#E8EAF0] shadow-neu-sm hover:shadow-neu-inset transition-all duration-200",
                        "text-[#7B80A0] hover:text-[#3B3F5C]",
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
                        <span className="text-xs ml-2 font-semibold whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left min-w-0">
                            Collapse
                        </span>
                    )}
                </button>
            </div>
        </aside>
    );
}
