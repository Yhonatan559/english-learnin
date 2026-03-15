import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  plugins: [
    react(),
    // Copiar index.html → 404.html para que Vercel sirva la SPA al refrescar en rutas como /login
    {
      name: 'copy-404',
      closeBundle() {
        const outDir = join(process.cwd(), 'dist');
        copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'));
      },
    },
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
});
