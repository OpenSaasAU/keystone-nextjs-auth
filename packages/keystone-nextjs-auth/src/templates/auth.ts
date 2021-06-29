import ejs from 'ejs';
import { AuthGqlNames } from '../types';

const template = `
import getNextAuthPage from '@opensaas/keystone-nextjs-auth/pages/NextAuthPage';
import { nextAuthProviders as Providers } from '@opensaas/keystone-nextjs-auth';
import { lists } from '.keystone/api';
import { providers }from '../../../../../keystone';

export default getNextAuthPage({
        identityField: '<%= identityField %>',
        mutationName: '<%= gqlNames.authenticateItemWithPassword %>',
        sessionData: '<%= sessionData %>',
        listKey: '<%= listKey %>',
        userMap: <%- JSON.stringify(userMap) %>,
        accountMap: <%- JSON.stringify(accountMap) %>,
        profileMap: <%- JSON.stringify(profileMap) %>,
        autoCreate: <%= autoCreate %>,
        providers,
        lists,
    });
  `;

export const authTemplate = ({
  gqlNames,
  identityField,
  sessionData,
  listKey,
  autoCreate,
  userMap,
  accountMap,
  profileMap,
}: {
  gqlNames: AuthGqlNames;
  identityField: string;
  sessionData: any;
  listKey: string;
  autoCreate: boolean;
}) => {
  const authOut = ejs.render(template, {
    gqlNames,
    identityField,
    sessionData,
    listKey,
    autoCreate,
    userMap,
    accountMap,
    profileMap,
  });
  return authOut;
};
