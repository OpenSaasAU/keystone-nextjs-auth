import { config } from '@keystone-next/keystone/schema';
import { statelessSessions } from '@keystone-next/keystone/session';
import {
  createAuth,
  nextAuthProviders as Providers,
} from '@opensaas/keystone-nextjs-auth';
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

const auth = createAuth({
  listKey: 'User',
  identityField: 'subjectId',
  sessionData: `id name email`,
  autoCreate: true,
  userMap: { subjectId: 'id', name: 'name' },
  accountMap: {},
  profileMap: { email: 'email' },
  keystonePath: '/admin',
});

export default auth.withAuth(
  config({
    // @ts-ignore
    server: {
      cors: {
        origin: [process.env.FRONTEND || 'http://localhost:7777'],
        credentials: true,
      },
    },
    db: {
      adapter: 'prisma_postgresql',
      url:
        process.env.DATABASE_URL ||
        'postgres://postgres:mysecretpassword@localhost:55000/opensaas-creator',
      useMigrations: true,
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
