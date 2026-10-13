import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Aparte de vite.config.ts para que los tests no carguen el plugin de .d.ts
// ni la configuración de librería.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // e2e/ son pruebas de Playwright, con su propio ejecutor.
    exclude: [...configDefaults.exclude, 'e2e/**'],
  },
});
