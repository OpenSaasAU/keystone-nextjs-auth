import ejs from 'ejs';

const template = `
const Path = require('path');
// @ts-ignore
const withPreconstruct = require('@preconstruct/next');

module.exports = withPreconstruct({
  webpack(config, { isServer }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: Path.dirname(require.resolve('react/package.json')),
      'react-dom': Path.dirname(require.resolve('react-dom/package.json')),
      '@keystone-next/keystone': Path.dirname(
        require.resolve('@keystone-next/keystone/package.json')
      ),
    };
    if (isServer) {
      config.externals = [
        ...config.externals, 
        /@keystone-next\\/keystone(?!\\/___internal-do-not-use-will-break-in-patch\\/admin-ui\\/id-field-view)/,
        /@keystone-next\\/types/, 
        /.prisma\\/client/
      ];
    }
    return config;
  },
});
`;
export const nextConfigTemplate = () => {
  const nextConfigOut = ejs.render(template, {});

  return nextConfigOut;
};
