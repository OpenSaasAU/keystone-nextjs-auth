import { AuthGqlNames } from '../types';

export const authTemplate = ({
  gqlNames,
  identityField,
}: {
  gqlNames: AuthGqlNames;
  identityField: string;
}) => {
  // -- TEMPLATE START
  return `

  import getNextAuthPage from '@opensaas/keystone-nextjs-auth/pages/NextAuthPage';



export default getNextAuthPage(${JSON.stringify({
  identityField: identityField,
  mutationName: gqlNames.authenticateItemWithPassword,
})});
`;
  // -- TEMPLATE END
};
