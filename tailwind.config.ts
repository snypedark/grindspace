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
                background: "#E8EAF0",
                surface: "#E8EAF0",
                border: "transparent",
                "text-primary": "#3B3F5C",
                "text-secondary": "#7B80A0",
                "text-label": "#A8ABBE",
                accent: "#7C6FF7",
                "accent-hover": "#5B51E0",
                "accent-light": "rgba(125,111,247,0.12)",
            },
            fontFamily: {
                sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
            },
            borderRadius: {
                "2xl": "18px",
                xl: "12px",
                lg: "10px",
            },
            boxShadow: {
                neu: "6px 6px 16px #C5C8D6, -6px -6px 16px #FFFFFF",
                "neu-hover": "8px 8px 20px #C5C8D6, -8px -8px 20px #FFFFFF",
                "neu-inset": "inset 4px 4px 10px #C5C8D6, inset -4px -4px 10px #FFFFFF",
                "neu-sm": "4px 4px 10px #C5C8D6, -4px -4px 10px #FFFFFF",
                "neu-lg": "10px 10px 30px #C5C8D6, -10px -10px 30px #FFFFFF",
                "neu-accent": "5px 5px 14px rgba(92,81,224,0.35), -2px -2px 6px rgba(255,255,255,0.6)",
                // Legacy compat
                card: "6px 6px 16px #C5C8D6, -6px -6px 16px #FFFFFF",
                "card-hover": "8px 8px 20px #C5C8D6, -8px -8px 20px #FFFFFF",
            },
            transitionTimingFunction: {
                smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
            },
            animation: {
                "fade-slide-up": "neuFadeUp 0.5s ease forwards",
                "fade-in": "fadeIn 0.3s ease forwards",
            },
            keyframes: {
                neuFadeUp: {
                    "0%": { opacity: "0", transform: "translateY(16px)" },
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
