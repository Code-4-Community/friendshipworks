import baseConfig from '../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    // The eslintrc -> flat conversion carried `ignorePatterns` over verbatim,
    // but the two resolve patterns differently: eslintrc resolved them against
    // the config file's directory, while Nx invokes ESLint with the workspace
    // root as the base path. Bare names would therefore mean <root>/dist and
    // stop ignoring this project's build output. `**/`-prefixed matches Nx's
    // own generator convention.
    ignores: ['**/.expo', '**/web-build', '**/cache', '**/dist'],
  },
];
