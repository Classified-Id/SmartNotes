import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Адрес вашего Express-сервера
        changeOrigin: true, // Изменяет заголовок Host
        rewrite: (path) => path.replace(/^\/api/, ''), // Удаляет префикс /api
      },
    },
  },
  resolve: {
    alias: {
      '@/Components': resolve(__dirname, './src/Components'),
      '@/Constants': resolve(__dirname, './src/Constants'),
      '@/Hooks': resolve(__dirname, './src/Hooks'),
      '@/Layers': resolve(__dirname, './src/Layers'),
      '@/Store': resolve(__dirname, './src/Store'),
      '@/Styles': resolve(__dirname, './src/Styles'),
      '@/Types': resolve(__dirname, './src/Types'),
      '@/UI': resolve(__dirname, './src/UI'),
      '@/Utils': resolve(__dirname, './src/Utils'),
      '@/Widgets': resolve(__dirname, './src/Widgets'),
      '@/ServiceWorker': resolve(__dirname, './src/ServiceWorker'),
    },
  },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     tsconfig: './tsconfig.app.json', // Явно указываем путь к tsconfig
  //   },
  // },
});
