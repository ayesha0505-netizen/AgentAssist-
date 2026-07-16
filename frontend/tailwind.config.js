/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brutal-black": "#0a0a0a",
        "brutal-charcoal": "#1a1a1a",
        "neon-lime": "#ccff00",
        "neon-pink": "#ff00ff",
        "neon-blue": "#00f0ff",
        "secondary-fixed-dim": "#4cd7f6",
        "surface-bright": "#363940",
        "surface-container": "#1d2026",
        "primary-fixed": "#e2dfff",
        "on-surface": "#e0e2eb",
        "surface-container-low": "#191c22",
        "tertiary-fixed": "#6ffbbe",
        "on-secondary-container": "#00424e",
        "on-secondary-fixed-variant": "#004e5c",
        "error-container": "#93000a",
        "on-tertiary": "#003824",
        "surface-container-high": "#272a31",
        "on-error-container": "#ffdad6",
        "tertiary-fixed-dim": "#4edea3",
        "background": "#10131a",
        "surface-variant": "#32353c",
        "secondary-container": "#03b5d3",
        "inverse-on-surface": "#2d3037",
        "secondary-fixed": "#acedff",
        "on-primary-fixed": "#0f0069",
        "primary": "#c3c0ff",
        "surface-tint": "#c3c0ff",
        "primary-container": "#4f46e5",
        "surface-container-highest": "#32353c",
        "on-surface-variant": "#c7c4d8",
        "on-error": "#690005",
        "surface": "#10131a",
        "surface-dim": "#10131a",
        "secondary": "#4cd7f6",
        "on-primary-container": "#dad7ff",
        "outline": "#918fa1",
        "on-tertiary-container": "#67f4b7",
        "tertiary-container": "#006e4b",
        "on-secondary-fixed": "#001f26",
        "on-tertiary-fixed": "#002113",
        "error": "#ffb4ab",
        "surface-container-lowest": "#0b0e14",
        "on-tertiary-fixed-variant": "#005236",
        "on-secondary": "#003640",
        "inverse-primary": "#4d44e3",
        "on-primary": "#1d00a5",
        "tertiary": "#4edea3",
        "primary-fixed-dim": "#c3c0ff",
        "on-background": "#e0e2eb",
        "outline-variant": "#464555",
        "inverse-surface": "#e0e2eb",
        "on-primary-fixed-variant": "#3323cc",
        dark: {
          950: "#05070B",
          900: "#0A0D14",
          850: "#10141F",
          800: "#161B2E",
          750: "#1E253E",
          700: "#26304E",
          600: "#38456C",
          500: "#50618A"
        },
        brand: {
          primary: "#5E6AD2",
          secondary: "#8B5CF6",
          accent: "#00F2FE",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
          glow: "rgba(94, 106, 210, 0.25)"
        }
      },
      spacing: {
        "xs": "4px",
        "margin": "32px",
        "gutter": "24px",
        "unit": "4px",
        "xl": "40px",
        "md": "16px",
        "sm": "8px",
        "lg": "24px"
      },
      fontFamily: {
        "editorial": ["Playfair Display", "serif"],
        "body-sm": ["Inter", "sans-serif"],
        "body-base": ["Inter", "sans-serif"],
        "display-lg": ["Plus Jakarta Sans", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "sans-serif"],
        "technical-label": ["JetBrains Mono", "monospace"],
        "technical-code": ["JetBrains Mono", "monospace"],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scale-up': 'scaleUp 0.2s ease-out',
        'shake': 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both'
      },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        scaleUp: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(94, 106, 210, 0.4)',
        'glow-accent': '0 0 25px -5px rgba(0, 242, 254, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.36)'
      }
    },
  },
  plugins: [],
}
