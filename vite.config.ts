import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa'; // Importamos el plugin PWA

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    VitePWA({ // Configuramos el plugin PWA
      registerType: 'autoUpdate',
      manifest: {
        name: 'Right Way Padres',
        short_name: 'RW_Padres',
        description: 'Plataforma de comunicación con padres de alumnos de Right Way English School',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: '/rw-192x192.png',  // Asegúrate de tener estos íconos en la carpeta public/
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/rw-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
