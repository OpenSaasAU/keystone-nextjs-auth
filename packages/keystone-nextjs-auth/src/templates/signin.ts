import { AuthGqlNames } from '../types';

export const signinTemplate = () => {
  // -- TEMPLATE START
  return `import { getSigninPage } from '@opensaas/keystone-nextjs-auth/pages/SigninPage'

export default getSigninPage();
`;
  // -- TEMPLATE END
};
