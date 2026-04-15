/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B1C2C',
          hover: '#12283D',
        },
        accent: '#F4B400',
        background: '#F5F7FA',
        'bg-main': '#F5F7FA',
        'bg-card': '#FFFFFF',
        card: '#FFFFFF',
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
        },
        success: '#22C55E',
        border: '#E5E7EB',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
export default config
