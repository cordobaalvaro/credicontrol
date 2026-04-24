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
    host: true, // Permitir acceso desde otros dispositivos en la red local
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // Forzar que busque .jsx primero
    }
  },
});
