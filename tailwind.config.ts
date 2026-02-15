import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2bee6c",
                "primary-dark": "#23c458",
                "background-light": "#f0fdf4", // Very soft pastel green/blue mix
                "background-dark": "#102216",
                "surface-light": "#ffffff",
                "surface-dark": "#1a3524",
                "accent-blue": "#60a5fa",
                "accent-yellow": "#fbbf24",
                "accent-red": "#f87171",
            },
            fontFamily: {
                display: ["Lexend", "sans-serif"],
            },
            borderRadius: {
                lg: "1.5rem",
                xl: "2rem",
                "2xl": "2.5rem",
                "3xl": "3rem",
            },
            boxShadow: {
                "3d": "0 6px 0 0 rgb(0 0 0 / 0.1)",
                "3d-primary": "0 6px 0 0 #1e9e49", // Darker shade of primary
                "3d-blue": "0 6px 0 0 #2563eb",
                "3d-red": "0 6px 0 0 #dc2626",
                card: "0 10px 30px -5px rgba(0, 0, 0, 0.05)",
            },
            animation: {
                "fade-in-up": "fadeInUp 0.5s ease-out forwards",
                "spin-slow": "spin 3s linear infinite",
            },
            keyframes: {
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
