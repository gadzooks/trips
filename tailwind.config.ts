// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
 darkMode: 'class',
 content: [
   "./pages/**/*.{js,ts,jsx,tsx,mdx}",
   "./components/**/*.{js,ts,jsx,tsx,mdx}", 
   "./app/**/*.{js,ts,jsx,tsx,mdx}",
 ],
 theme: {
   screens: {
     'sm': '640px',
     'md': '768px', 
     'lg': '1024px',
     'xl': '1280px',
     '2xl': '1536px'
   },
   extend: {
     fontFamily: {
       sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
       display: ['var(--font-roboto)', 'system-ui', 'sans-serif'],
     },
     colors: {
       background: "var(--background)",
       foreground: "var(--foreground)",
       primary: {
         50: "var(--primary-50)",
         100: "var(--primary-100)",
         // Add more shades as needed
       },
       // Add more color tokens as needed
     },
     maxWidth: {
       '8xl': '88rem',
     },
     container: {
       center: true,
       padding: {
         DEFAULT: '1rem',
         sm: '2rem',
         lg: '4rem',
         xl: '5rem',
         '2xl': '6rem',
       },
     },
   },
 },
 plugins: [],
} satisfies Config;