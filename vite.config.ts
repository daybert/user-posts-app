import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.BASE_URL || 'https://jsonplaceholder.typicode.com';

  return {
    plugins: [react()],
    define: {
      'process.env.BASE_URL': JSON.stringify(apiUrl),
      'import.meta.env.VITE_BASE_URL': JSON.stringify(apiUrl),
    },
    resolve: {
      preserveSymlinks: true,
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
    },
  };
});
