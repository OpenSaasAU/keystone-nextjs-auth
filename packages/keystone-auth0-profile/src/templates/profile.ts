import ejs from 'ejs';

const template = `
import { getProfilePage } from '@opensaas/keystone-auth0-profile/pages/ProfilePage';


export default getProfilePage({ listKey: '<%= listKey %>' });
  `;

export const profileTemplate = ({ listKey }: { listKey: string }) => {
  const profileOut = ejs.render(template, { listKey });
  return profileOut;
};
