import { AuthGqlNames, Provider } from '../types';
import ejs from 'ejs';

const template = `
import Path from 'path';
// @ts-ignore
import withPreconstruct from '@preconstruct/next';

export const config = withPreconstruct({
  webpack(config: any, { isServer }: any) {
    config.resolve.alias = {
      ...config.resolve.alias,
      react: Path.dirname(require.resolve('react/package.json')),
      'react-dom': Path.dirname(require.resolve('react-dom/package.json')),
      '@keystone-next/keystone': Path.dirname(
        require.resolve('@keystone-next/keystone/package.json')
      ),
    };
    if (isServer) {
      config.externals = [...config.externals, /@keystone-next\\/keystone/, /@keystone-next\\/types/, /.prisma\\/client/];
    }
    return config;
  },
});
`
export const nextConfigTemplate = () => {
    const nextConfigOut = ejs
          .render(template,{});
          
    return nextConfigOut;
  };