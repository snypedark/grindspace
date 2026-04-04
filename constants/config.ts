export const APP_NAME = "GrindSpace";
export const APP_TAGLINE = "Track. Level up. Dominate.";

export const MOCK_USER = {
    name: "Kunal",
    username: "kunal_dev",
    avatar: null,
    level: 24,
    xp: 8420,
    xpToNext: 10000,
    streak: 14,
    rank: 12,
};

export const NAV_ITEMS = [
    { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { label: "Analytics", href: "/analytics", icon: "BarChart3" },
    { label: "Leaderboard", href: "/leaderboard", icon: "Trophy" },
    { label: "Friends", href: "/friends", icon: "Users" },
    { label: "Profile", href: "/profile", icon: "User" },
] as const;
