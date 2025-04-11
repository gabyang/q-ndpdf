import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'main.js'
    }
  },
  server: {
    port: 3000,
  },
});