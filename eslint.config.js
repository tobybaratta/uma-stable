import globals from 'globals'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default [
  {
    ignores: ['dist', 'build', 'node_modules']
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react,
      'react-hooks': reactHooks
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // TS base rules
      ...tseslint.configs.recommended.rules,
      // React
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      // Hooks
      ...reactHooks.configs['recommended-latest'].rules
    }
  },
  // Keep Prettier LAST to disable conflicting stylistic rules
  eslintConfigPrettier
]
