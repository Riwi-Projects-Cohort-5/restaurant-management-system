import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: ".",
  publicDir: "public",
  server: {
    port: 3000,
    open: true,
  },
  plugins: [
    tailwindcss(),
  ],
});
