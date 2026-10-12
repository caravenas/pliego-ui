import type { StorybookConfig } from '@storybook/react-vite';
import type { PluginOption } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  staticDirs: ['../public'],
  core: { disableTelemetry: true },
  // Storybook hereda vite.config.ts; el plugin de .d.ts es solo para el build
  // de librería y aquí ensuciaría la salida.
  viteFinal: (cfg) => {
    const isDts = (p: PluginOption) =>
      !!p && typeof p === 'object' && 'name' in p && p.name === 'vite:dts';
    cfg.plugins = (cfg.plugins ?? []).flat().filter((p) => !isDts(p as PluginOption));
    return cfg;
  },
};

export default config;
