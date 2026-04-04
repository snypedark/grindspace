import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#FFFFFF",
                surface: "#F8FAFC",
                border: "#E5E7EB",
                "text-primary": "#0F172A",
                "text-secondary": "#64748B",
                accent: "#6366F1",
                "accent-hover": "#4F46E5",
                "accent-light": "#EEF2FF",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "system-ui", "sans-serif"],
            },
            borderRadius: {
                "2xl": "16px",
                xl: "12px",
            },
            boxShadow: {
                card: "0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.04)",
                "card-hover": "0 8px 25px -5px rgba(0,0,0,0.1), 0 4px 10px -5px rgba(0,0,0,0.06)",
                button: "0 1px 2px 0 rgba(99,102,241,0.2)",
                "button-hover": "0 4px 12px 0 rgba(99,102,241,0.35)",
            },
            transitionTimingFunction: {
                smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
            animation: {
                "fade-slide-up": "fadeSlideUp 0.4s ease forwards",
                "fade-in": "fadeIn 0.3s ease forwards",
            },
            keyframes: {
                fadeSlideUp: {
                    "0%": { opacity: "0", transform: "translateY(12px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
