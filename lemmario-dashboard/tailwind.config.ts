import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // AtLiTeG Design System Colors
        primary: {
          DEFAULT: "#0B5FA5",
          hover: "#094E88",
          light: "#E6F0FA",
        },
        accent: {
          DEFAULT: "#3B82F6",
          hover: "#2563EB",
        },
        background: {
          DEFAULT: "#FFFFFF",
          muted: "#F6F8FB",
        },
        text: {
          primary: "#1F2937",
          secondary: "#4B5563",
          muted: "#6B7280",
          inverse: "#FFFFFF",
        },
        border: {
          DEFAULT: "#E5E7EB",
          divider: "#D1D5DB",
        },
        link: {
          DEFAULT: "#0B5FA5",
          hover: "#094E88",
        },
        // Navigation colors
        nav: {
          bg: "#0B5FA5",
          text: "#FFFFFF",
          hover: "#E6F0FA",
        },
        // Timeline colors
        timeline: {
          dot: "#3B82F6",
          line: "#D1D5DB",
        },
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '22px',
        '2xl': '28px',
        '3xl': '36px',
      },
      lineHeight: {
        'tight': '1.2',
        'normal': '1.5',
        'relaxed': '1.7',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '8px',
      },
      maxWidth: {
        'container': '1200px',
        'content': '1040px',
      },
      fontFamily: {
        sans: [
          "Inter",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        'card': '0 2px 6px rgba(0,0,0,0.05)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
      },
      transitionTimingFunction: {
        'fast': 'ease-out',
        'normal': 'ease',
      },
    },
  },
  plugins: [],
};

export default config;
