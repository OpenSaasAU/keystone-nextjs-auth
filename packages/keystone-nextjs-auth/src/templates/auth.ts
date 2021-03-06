import ejs from 'ejs';
import { NextAuthTemplateProps } from '../pages/NextAuthPage';

const template = `
import getNextAuthPage from '@opensaas/keystone-nextjs-auth/pages/NextAuthPage';
import keystoneConfig from '../../../../../keystone';
import { PrismaClient } from '.prisma/client';
import { createQueryAPI } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/node-api';

const keystoneQueryAPI = global.keystoneQueryAPI || createQueryAPI(keystoneConfig, PrismaClient);

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
}: NextAuthTemplateProps) => {
  const authOut = ejs.render(template, {
    identityField,
    sessionData,
    listKey,
    autoCreate,
    sessionSecret,
  });
  return authOut;
};
