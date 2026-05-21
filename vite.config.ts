import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/mathew-alhena-design-exercise/",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
