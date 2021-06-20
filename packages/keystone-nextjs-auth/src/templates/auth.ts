import { AuthGqlNames } from '../types';

import Providers from 'next-auth/providers';

export const authTemplate = ({
  gqlNames,
  identityField,
  providers
}: {
  gqlNames: AuthGqlNames;
  identityField: string;
  providers: typeof Providers;
}) => {
  // -- TEMPLATE START
  return `

  import getNextAuthPage from '@opensaas-keystone/nextjs-auth/pages/NextAuthPage';



export default getNextAuthPage(${JSON.stringify({
  identityField: identityField,
  mutationName: gqlNames.authenticateItemWithPassword,
  providers: providers
})});
`;
  // -- TEMPLATE END
};
