import type { Config } from "tailwindcss";
import { palettes, rounded, shade, components} from "@tailus/themer"
import tailwindScrollbar from 'tailwind-scrollbar';



export default {
  // darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",

    "./node_modules/@tailus/themer/dist/components/**/*.{js,ts}",
],
  theme: {
    extend: {
      // colors: {
      //   background: "var(--background)",
      //   foreground: "var(--foreground)",
      // },
      colors: palettes.trust,
   
    },
  },
  plugins:
  [
    tailwindScrollbar,
    rounded,
    shade,
    components
  ],
} satisfies Config;
