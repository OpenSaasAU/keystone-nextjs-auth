import ejs from 'ejs';

const template = `
const Path = require('path');
// @ts-ignore
const withPreconstruct = require('@preconstruct/next');

module.exports = withPreconstruct({
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
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
        /@keystone-next\\/keystone(?!\\/___internal-do-not-use-will-break-in-patch\\/admin-ui\\/id-field-view|\\/fields\\/types\\/[^\\/]+\\/views)/,
        /.prisma\\/client/
      ];
    }
    return config;
  },
  basePath: '<%= keystonePath || '' %>'
});
`;
export const nextConfigTemplate = ({
  keystonePath,
}: {
  keystonePath: string;
}) => {
  const nextConfigOut = ejs.render(template, { keystonePath });

  return nextConfigOut;
};
