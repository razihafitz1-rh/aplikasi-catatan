import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Tambahkan ini

export default defineConfig({
  // GitHub Pages project site lives at /razz/, so assets must be relative to it
  base: '/razz/',
  plugins: [
    react(),
    tailwindcss(), // Tambahkan ini
  ],
})