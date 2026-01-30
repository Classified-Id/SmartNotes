module.exports = {
  ignorePatterns: ['dist/', '**/*.js'],
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/ban-ts-comment': 1,
    semi: ['error', 'always'],
    'arrow-parens': ['error', 'always'],
    'jsx-quotes': ['error', 'prefer-single'],
  },
  overrides: [
    {
      files: ['client/**/*.{ts,js,tsx,jsx}'],
      rules: {
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              ['parent', 'sibling', 'index'],
            ],
            pathGroups: [
              {
                pattern: '@/**',
                group: 'internal',
                position: 'before',
              },
            ],
            pathGroupsExcludedImportTypes: ['builtin'],
            'newlines-between': 'always',
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
          },
        ],
      },
    },
    {
      files: ['server/**/*.{ts,js,tsx,jsx}'],
      rules: {
        'import/order': 'off',
      },
    },
  ],
};
