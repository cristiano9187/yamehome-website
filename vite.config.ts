import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/yamehome-website/', // <--- C'est ici que la magie opère
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})