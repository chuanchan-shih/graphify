/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E76F51',
        accent: '#F4A261',
        success: '#52B788',
        warn: '#FF6B6B',
        cream: '#FFF5E6',
        ink: '#2C1810',
        muted: '#888888',
        fire: '#FF6B35',
        water: '#4AB8D8',
        grass: '#52C46A',
        elec: '#FFD166',
        light: '#FFF0A0',
        dark: '#9B72CF',
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        sans: ['"Noto Sans TC"', '"Baloo 2"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 4px 24px rgba(0,0,0,0.08)',
        glow: '0 0 18px rgba(231,111,81,0.45)',
      },
      keyframes: {
        bob: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.85)', opacity: 0 },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        sparkle: {
          '0%,100%': { opacity: 0.4, transform: 'scale(0.9)' },
          '50%': { opacity: 1, transform: 'scale(1.1)' },
        },
      },
      animation: {
        bob: 'bob 3s ease-in-out infinite',
        pop: 'pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        sparkle: 'sparkle 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
