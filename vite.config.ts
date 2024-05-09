import { defineConfig } from 'vite';
import { defineConfig as defineVitestConfig, mergeConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default mergeConfig(
  defineConfig({}),
  defineVitestConfig({
    test: {
      include: ['src/**/__test__/*'],
    },
  })
);
