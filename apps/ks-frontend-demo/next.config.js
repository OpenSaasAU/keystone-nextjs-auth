const withPreconstruct = require('@preconstruct/next');

module.exports = withPreconstruct({
  publicRuntimeConfig: {
    backend: process.env.BACKEND,
    stripeKey: process.env.STRIPE_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:auth*',
        destination: 'http://localhost:3000/api/auth/:auth*',
      },
    ];
  },
});
