import { defineConfig } from 'vite';

export default defineConfig({
  base: '/q-ndpdf/',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/index.html'
    },
    assetsInclude: ['**/*.css']
  },
  server: {
    port: 3000,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
      overlay: true
    },
    watch: {
      usePolling: true
    }
  },
});