import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
    },
  },
  // For GitHub Pages: set to repo name like '/category_theory/'
  // For local dev or custom domain: use '/'
  // Can be overridden with VITE_BASE_URL env variable
  base: process.env.VITE_BASE_URL || '/category_theory/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
