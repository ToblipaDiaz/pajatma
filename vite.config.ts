import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/pajatma/', // Configura el nombre del repositorio aquí
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    open: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'date-fns', 'lucide-react']
  }
});
