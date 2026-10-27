import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,ts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      eqeqeq: 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      curly: 'error',
    },
  },
  // Last, so it turns off any formatting rules that would conflict with Prettier
  prettier,
]);
