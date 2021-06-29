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
        destination: `${process.env.BACKEND_BASE_URL}/api/auth/:auth*`,
      },
    ];
  },
});
