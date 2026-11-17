import { defineConfig } from 'vite-plus'

export default defineConfig({
  fmt: {
    singleQuote: true,
    semi: false,
    overrides: [
      {
        files: ['packages/fews-ssd-webcomponent/**'],
        options: {
          arrowParens: 'avoid',
          bracketSpacing: true,
          bracketSameLine: false,
          jsxSingleQuote: false,
          quoteProps: 'consistent',
          printWidth: 180,
          semi: false,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'all',
          useTabs: false,
        },
      },
    ],
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        files: ['packages/fews-ssd-requests/**'],
        rules: {
          'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
          'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        },
      },
    ],
  },
})
