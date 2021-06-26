import ejs from 'ejs';
import { AuthGqlNames, Provider } from '../types';

const template = `
import getNextAuthPage from '@opensaas/keystone-nextjs-auth/pages/NextAuthPage';
import { nextAuthProviders as Providers } from '@opensaas/keystone-nextjs-auth';
import { lists } from '.keystone/api';

export default getNextAuthPage({
        identityField: '<%= identityField %>',
        mutationName: '<%= gqlNames.authenticateItemWithPassword %>',
        sessionData: '<%= sessionData %>',
        listKey: '<%= listKey %>',
        userMap: <%- JSON.stringify(userMap) %>,
        accountMap: <%- JSON.stringify(accountMap) %>,
        profileMap: <%- JSON.stringify(profileMap) %>,
        autoCreate: <%= autoCreate %>,
        providers:[ <% for (const i in providers){ %>
            Providers.<%= providers[i].name %>({
                <% const providerConf = providers[i].config;
                for (const key in providerConf) { %>
                    <%= key %>: '<%= providerConf[key] %>',
                <%}%>
                }),
        <% } %>
        ],
        lists,
    });
  `;

export const authTemplate = ({
  gqlNames,
  identityField,
  providers,
  sessionData,
  listKey,
  autoCreate,
  userMap,
  accountMap,
  profileMap,
}: {
  gqlNames: AuthGqlNames;
  identityField: string;
  providers: Provider[];
  sessionData: any;
  listKey: string;
  autoCreate: boolean;
}) => {
  const authOut = ejs.render(template, {
    gqlNames,
    identityField,
    providers,
    sessionData,
    listKey,
    autoCreate,
    userMap,
    accountMap,
    profileMap,
  });
  return authOut;
};
