import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // Importante para Electron
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    port: 5173, // Puerto estándar de Vite
    strictPort: true, // Fallar si el puerto no está disponible
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // Forzar que busque .jsx primero
    }
  },
});
