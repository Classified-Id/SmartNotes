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
      '@Components': resolve(__dirname, 'src/Components'),
      '@Pages': resolve(__dirname, 'src/Pages'),
      '@Utils': resolve(__dirname, 'src/Utils'),
      '@Store': resolve(__dirname, 'src/Store'),
      '@Hooks': resolve(__dirname, 'src/Hooks'),
      '@Types': resolve(__dirname, 'src/Types'),
      '@Game': resolve(__dirname, 'src/GameEngine'),
      '@Constants': resolve(__dirname, 'src/Constants'),
      '@RenderFunctions': resolve(__dirname, 'src/RenderFunctions'),
      '@ServiceWorker': resolve(__dirname, 'src/ServiceWorker'),
    },
  },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     tsconfig: './tsconfig.app.json', // Явно указываем путь к tsconfig
  //   },
  // },
});
