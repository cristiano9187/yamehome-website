import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/yamehome-website/', 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 👇 C'EST ICI LA NOUVEAUTÉ POUR LA VITESSE
  build: {
    chunkSizeWarningLimit: 500, // Alerte si un fichier dépasse 500ko
    rollupOptions: {
      output: {
        manualChunks: {
          // On sépare React du reste pour que ce soit plus léger
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})