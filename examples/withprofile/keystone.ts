import { config } from '@keystone-next/keystone/schema';
import { statelessSessions } from '@keystone-next/keystone/session';
import {
  auth0Profile,
  nextAuthProviders as Providers,
} from '@opensaas/keystone-auth0-profile';
import { KeystoneContext } from '@keystone-next/types';
import { lists } from './schemas';

let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'The SESSION_SECRET environment variable must be set in production'
    );
  } else {
    sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
  }
}

const sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

export const providers = [
  Providers.Auth0({
    clientId: process.env.AUTH0_CLIENT_ID || 'Auth0ClientID',
    clientSecret: process.env.AUTH0_CLIENT_SECRET || 'Auth0ClientSecret',
    domain: process.env.AUTH0_DOMAIN || 'opensaas.au.auth0.com',
  }),
];

const profile = auth0Profile({
  listKey: 'User',
  identityField: 'subjectId',
  sessionData: `id name email`,
  autoCreate: true,
  userMap: { subjectId: 'id', name: 'name' },
  accountMap: {},
  profileMap: { email: 'email' },
});

export default profile.withProfile(
  config({
    // @ts-ignore
    server: {
      cors: {
        origin: [process.env.FRONTEND || 'http://localhost:7777'],
        credentials: true,
      },
    },
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL || 'file:./keystone-example.db',
    },
    ui: {
      isAccessAllowed: (context: KeystoneContext) => !!context.session?.data,
    },
    lists,
    session: statelessSessions({
      maxAge: sessionMaxAge,
      secret: sessionSecret,
    }),
    experimental: {
      generateNodeAPI: true,
    },
  })
);
