const withPreconstruct = require('@preconstruct/next');

module.exports = withPreconstruct({
  publicRuntimeConfig: {
    backend: process.env.BACKEND,
    stripeKey: process.env.STRIPE_KEY,
    backendBaseUrl: process.env.BACKEND_BASE_URL,
    publicUrl: process.env.PUBLIC_URL,
  },
});
