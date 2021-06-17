module.exports = {
  presets: [
    "@babel/preset-react",
    "@babel/preset-typescript",
    [
        "@babel/preset-env", {
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
    ],
  ],
  plugins: []
};
