import ejs from 'ejs';
import { NextAuthTemplateProps } from '../pages/NextAuthPage';

const template = `
import { getContext } from '@keystone-6/core/context';
import getNextAuthPage from '@opensaas/keystone-nextjs-auth/pages/NextAuthPage';
import keystoneConfig from '../../../../../keystone';
import * as PrismaModule from '<%= prismaClientPath %>';

const keystoneQueryAPI = global.keystoneQueryAPI || getContext(keystoneConfig, PrismaModule).sudo().query;

if (process.env.NODE_ENV !== 'production') globalThis.keystoneQueryAPI = keystoneQueryAPI

export default getNextAuthPage({
        autoCreate: <%= autoCreate %>,
        identityField: '<%= identityField %>',
        listKey: '<%= listKey %>',
        pages: keystoneConfig.pages,
        providers: keystoneConfig.providers,
        query: keystoneQueryAPI,
        resolver: keystoneConfig.resolver,
        sessionData: '<%= sessionData %>',
        sessionSecret: '<%= sessionSecret %>',
    });
  `;

export const authTemplate = ({
  autoCreate,
  identityField,
  listKey,
  sessionData,
  sessionSecret,
  prismaClientPath,
}: NextAuthTemplateProps) => {
  const authOut = ejs.render(template, {
    identityField,
    sessionData,
    listKey,
    autoCreate,
    sessionSecret,
    prismaClientPath,
  });
  return authOut;
};
