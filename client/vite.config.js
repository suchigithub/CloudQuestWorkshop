/* ==========================================================
 * Vite Configuration
 * 
 * - React plugin for JSX/Fast Refresh
 * - Proxy /api calls to .NET backend during development
 * - Build output goes to ../server/wwwroot for production
 * ========================================================== */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../server/wwwroot',
    emptyOutDir: true,
  },
});
