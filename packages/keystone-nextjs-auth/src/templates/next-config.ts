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
      '@keystone-6/core': Path.dirname(
        require.resolve('@keystone-6/core/package.json')
      ),
    };
    if (isServer) {
      config.externals = [
        ...config.externals, 
        /@keystone-6\\/core(?!\\/___internal-do-not-use-will-break-in-patch\\/admin-ui\\/id-field-view|\\/fields\\/types\\/[^\\/]+\\/views)/,
        /.prisma\\/client/
      ];
    // we need to set these to true so that when __dirname/__filename is used
    // to resolve the location of field views, we will get a path that we can use
    // rather than just the __dirname/__filename of the generated file.
    // https://webpack.js.org/configuration/node/#node__filename
    (_config$node = config.node) !== null && _config$node !== void 0 ? _config$node : config.node = {};
    config.node.__dirname = true;
    config.node.__filename = true;
    }
    return config;
  },
  <% if (keystonePath) { %>
    <% if (process.env.NODE_ENV != 'production') { %> 
  async rewrites() {
    return [
      {
        source: '/api/__keystone_api_build',
        destination: 'http://localhost:<%= process.env.PORT || 3000 %><%= keystonePath || '' %>/api/__keystone_api_build',
        basePath: false
      }
    ];
  },
  <% }%>
  basePath: '<%= keystonePath || '' %>'
  <% } %>
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
