import 'dotenv/config';
import * as Path from 'path';
import { config } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session';
import Auth0 from '@opensaas/keystone-nextjs-auth/providers/auth0';
import { createAuth } from '@opensaas/keystone-nextjs-auth';
import { KeystoneContext } from '@keystone-6/core/types';
import { lists } from './schemas';

let sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('The SESSION_SECRET environment variable must be set in production');
  } else {
    sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
  }
}

const sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

const auth = createAuth({
  listKey: 'User',
  identityField: 'subjectId',
  sessionData: `id name email`,
  autoCreate: true,
  resolver: async ({ user, profile }: { user: any; profile: any }) => {
    const name = user.name as string;
    const email = profile.email as string;
    return { email, name };
  },
  pages: {
    signIn: '/admin/auth/signin',
  },
  keystonePath: '/admin',
  sessionSecret,
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID || 'Auth0ClientID',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || 'Auth0ClientSecret',
      issuer: process.env.AUTH0_ISSUER_BASE_URL || 'https://opensaas.au.auth0.com',
    }),
  ],
});

export default auth.withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND || 'http://localhost:7777'],
        credentials: true,
      },
    },
    db: {
      provider: 'postgresql',
      url:
        process.env.DATABASE_URL ||
        'postgres://postgres:mysecretpassword@localhost:55000/opensaas-local',
      useMigrations: true,
    },
    ui: {
      isAccessAllowed: (context: KeystoneContext) => !!context.session?.data,
      publicPages: ['/admin/auth/signin', '/admin/auth/error'],
      getAdditionalFiles: [
        async () => [
          {
            mode: 'copy',
            inputPath: Path.resolve('./customPages/signin.js'),
            outputPath: 'pages/auth/signin.js',
          },
          {
            mode: 'copy',
            inputPath: Path.resolve('./customPages/error.js'),
            outputPath: 'pages/auth/error.js',
          },
        ],
      ],
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
