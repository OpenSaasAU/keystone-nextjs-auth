import ejs from 'ejs';
import { NextAuthPageProps } from '../pages/NextAuthPage';

const template = `
import getNextAuthPage from '@opensaas/keystone-nextjs-auth/pages/NextAuthPage';
import { query } from '.keystone/api';
import keystoneConfig from '../../../../../keystone';

export default getNextAuthPage({
        autoCreate: <%= autoCreate %>,
        identityField: '<%= identityField %>',
        listKey: '<%= listKey %>',
        pages: keystoneConfig.pages,
        providers: keystoneConfig.providers,
        query,
        resolver: keystoneConfig.resolver,
        sessionData: '<%= sessionData %>',
        sessionSecret: '<%= sessionSecret %>',
    });
  `;

type AuthTemplateOptions = NextAuthPageProps;

export const authTemplate = ({
  autoCreate,
  identityField,
  listKey,
  sessionData,
  sessionSecret,
}: AuthTemplateOptions) => {
  const authOut = ejs.render(template, {
    identityField,
    sessionData,
    listKey,
    autoCreate,
    sessionSecret,
  });
  return authOut;
};
