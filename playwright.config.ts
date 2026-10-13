import { defineConfig, devices } from '@playwright/test';

const PORT = 6007;

// Las pruebas leen el Storybook ya compilado (`npm run build-storybook`): es lo
// que se publica, y no depende de un servidor de desarrollo.
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    ...devices['Desktop Chrome'],
    // Un viewport pequeño y fijo: cada story se compara a un tamaño estable.
    viewport: { width: 640, height: 480 },
  },
  webServer: {
    command: `node scripts/serve-static.mjs storybook-static`,
    url: `http://127.0.0.1:${PORT}/index.json`,
    reuseExistingServer: !process.env.CI,
  },
});
