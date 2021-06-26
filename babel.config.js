module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      'next/babel',
      {
        'preset-env': {
          targets: {
            node: 14,
            browsers: [
              'last 2 chrome versions',
              'last 2 firefox versions',
              'last 2 safari versions',
              'last 2 edge versions',
            ],
          },
        },
        'transform-runtime': {
          helpers: false,
          corejs: 3,
        },
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
        helpers: false,
      },
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
  ],
};
