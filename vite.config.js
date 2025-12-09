import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',   // ensures all built assets use relative paths
  plugins: [
    vue(),
    tailwindcss()
  ],
  build: {
    outDir: 'dist'
  }
});
