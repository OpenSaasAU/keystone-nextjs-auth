const reactComponentTypeMessage = {
  message:
    'This type includes the children prop which is generally wrong, instead of using this type, type the props of the component',
};

module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  plugins: [
    'react',
    'react-hooks',
    'jest',
    'import',
    '@typescript-eslint',
    '@preconstruct/format-js-tag',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    curly: ['error', 'multi-line'],
    'jsx-quotes': 'error',
    'no-trailing-spaces': 'error',
    'no-undef': 'error',
    'no-unused-expressions': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'import/no-extraneous-dependencies': ['error'],
    'import/no-unresolved': 'error',
    'import/order': 'error',
    'jest/valid-describe': 'off',
    'jest/valid-expect': 'off',
    'jest/no-conditional-expect': 'off',
    'jest/no-standalone-expect': 'off',
    'jest/expect-expect': 'off',
    'jest/no-export': 'off',
    'jest/valid-title': 'off',
    'jest/no-try-expect': 'off',
    'jest/no-disabled-tests': 'error',
    'object-curly-spacing': ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'react/jsx-boolean-value': 'warn',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-wrap-multilines': 'warn',
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    'react/no-unknown-property': 'warn',
    'react/react-in-jsx-scope': 'error',
    'react/self-closing-comp': 'warn',
    'react/sort-prop-types': 'warn',
    semi: 'error',
    strict: 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        extendDefaults: false,
        types: {
          Function:
            '`Function` types are unsafe. Use more specific function types instead. e.g. (arg: number) => string',
          String: {
            message:
              'The `String` type refers to the String object which is probably not what you want, you probably want `string` instead which refers to the string primitive type.',
            fixWith: 'string',
          },
          ComponentType: reactComponentTypeMessage,
          FC: reactComponentTypeMessage,
          SFC: reactComponentTypeMessage,
          'React.ComponentType': reactComponentTypeMessage,
          'React.FC': reactComponentTypeMessage,
          'React.SFC': reactComponentTypeMessage,
        },
      },
    ],
    '@preconstruct/format-js-tag/format': 'error',
  },
  extends: ['plugin:jest/recommended'],

  overrides: [
    {
      files: ['packages/fields/src/**/*.{js,ts,tsx}'],
      rules: {
        'import/no-commonjs': 'error',
      },
    },
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        // TypeScript already checks for the following things and they conflict with TypeScript
        'import/no-unresolved': 'off',
        'no-undef': 'off',
      },
    },
  ],
};
