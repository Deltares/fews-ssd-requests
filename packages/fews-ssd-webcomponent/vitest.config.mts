import { playwright } from 'vite-plus/test/browser-playwright'
import { defineVitestConfig } from '@stencil/vitest/config'
import { stencilVitestPlugin } from '@stencil/vitest/plugin'

export default defineVitestConfig({
  stencilConfig: './stencil.config.ts',
  optimizeDeps: {
    include: ['@stencil/core/internal/client'],
  },
  test: {
    projects: [
      {
        plugins: [stencilVitestPlugin()],
        test: {
          name: 'unit',
          include: ['test/unit/**/*.spec.ts'],
          environment: 'stencil',
        },
      },
      {
        plugins: [stencilVitestPlugin()],
        test: {
          name: 'browser',
          include: ['test/e2e/**/*.e2e.ts'],
          environment: 'stencil',
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
