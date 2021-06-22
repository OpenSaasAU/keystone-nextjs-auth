import { AuthGqlNames, Provider } from '../types';
import ejs from 'ejs';

const template = `
import getNextAuthPage from '@opensaas/keystone-nextjs-auth/pages/NextAuthPage';
import { nextAuthProviders as Providers } from '@opensaas/keystone-nextjs-auth';

export default getNextAuthPage({
        identityField: '<%= identityField %>',
        mutationName: '<%= gqlNames.authenticateItemWithPassword %>',
        providers:[ <% for (const i in providers){ %>
            Providers.<%= providers[i].name %>({
                <% const providerConf = providers[i].config;
                for (const key in providerConf) { %>
                    <%= key %>: '<%= providerConf[key] %>',
                <%}%>
                }),
        <% } %>
        ],
    });
  `

export const authTemplate = ({
  gqlNames,
  identityField,
  providers
}: {
  gqlNames: AuthGqlNames;
  identityField: string;
  providers: Provider[];
}) => {
  const authOut = ejs
        .render(template, { gqlNames: gqlNames, identityField: identityField, providers: providers});
  return authOut;
};
