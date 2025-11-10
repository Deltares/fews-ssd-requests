import { resolve } from 'path'

import rollupPluginTypescript from '@rollup/plugin-typescript'
import { defineConfig } from 'vite'

function resolveRelativePath(relative: string): string {
  return resolve(__dirname, relative)
}

export default defineConfig({
  build: {
    lib: {
      entry: resolveRelativePath('src/index.ts'),
      formats: ['es'],
      name: 'fews-ssd-requests',
      fileName: 'fews-ssd-requests'
    },
    rollupOptions: {
      plugins: [
        rollupPluginTypescript({
          allowImportingTsExtensions: false,
          declaration: true,
          declarationDir: resolveRelativePath('dist'),
          rootDir: resolveRelativePath('src')
        })
      ]
    }
  }
})
