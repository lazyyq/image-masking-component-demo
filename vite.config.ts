import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/image-masking-component-demo/' : '/',
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
