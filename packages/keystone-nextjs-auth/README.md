# Keystone next auth
This package that enables the adition of social auth to keystone-6.

## Contents

- [About](#about)
- [Adding to your project](#adding-to-your-project)
- [Configuration](#configuration)
- [Contributing](#contributing)

## About
This uses NextAuth.js (https://next-auth.js.org/) project to add social auth to Keystone-6 (https://keystonejs.com/). Primary testing has been done with Auth0, happy for others to test other providers/give feedback or send through a PR.

## Adding to your project

Add package by `yarn add @opensaas/keystone-nextjs-auth` then add the following to your `keystone.ts`:

Add import...

```javascript
import {
  createAuth,
  nextAuthProviders as Providers,
} from '@opensaas/keystone-nextjs-auth';
```

Add you Auth configuration including providers
for Provider configuration see https://next-auth.js.org/configuration/providers.

```javascript
const auth = createAuth({
  listKey: 'User',
  identityField: 'subjectId',
  sessionData: `id name email`,
  autoCreate: true,
  userMap: { subjectId: 'id', name: 'name' },
  accountMap: {},
  profileMap: { email: 'email' },
  keystonePath: '/admin',
  providers: [
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID || 'Auth0ClientID',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || 'Auth0ClientSecret',
      domain: process.env.AUTH0_DOMAIN || 'opensaas.au.auth0.com',
    }),
]
});
```
Wrap your keystone config in `auth.withAuth`. Note that `generateNodeAPI` is required.

```javascript
export default auth.withAuth(
  config({
    server: {},
    db: {},
    ui: {},
    lists,
    experimental: {
      generateNodeAPI: true,
    },
    ...
  });
```

## Configuration
Provider configuration see https://next-auth.js.org/configuration/providers.
For Keystone-6 Configuration see https://keystonejs.com/
for example see the example [backend](./backend)

-  listKey - the list for authentication (generally `'User'`). Make sure any required fields are set using the `*Map` fields, see note below. 
-  identityField - The field that stores the identity/subjectId in keystone (generally `'subjectId'`). You will need to add this field to your list schema specified by `listKey`. An example can be found [here](./backend/schemas/User.ts).
-  sessionData - Data to be stored in the session ( something like `'id name email'`),
-  autoCreate - boolean to autocreate a user when they log in
-  userMap: `key:value` pairs that define what is copied from the User object returned from NextAuth in the SignIn callback (https://next-auth.js.org/configuration/callbacks#sign-in-callback) Left side is Keystone side, right is what comes from NextAuth eg: `{ subjectId: 'id', name: 'name' }`
-  accountMap - As Above but for the Account object
-  profileMap - As Above but for the Profile object
-  keystonePath - the path you want to access keystone from your frontend app (if required).

Note: The Keystone `create-keystone-app` CLI app (generally run with `yarn create keystone-app`/`npm init keystone-app`) will set a required `password` field on the `User` list. If you've used this to set up your project you will need to modify your list schema to set the field as not required, or remove it entirely if you don't plan to use the default Keystone auth system at all.

## Contributing
If you want to run this package locally
After cloning run `yarn install` and either:
- `yarn dev` to run both the frontend and backend or
- `yarn dev:backend` for just the backend

The [Demo App](./apps/ks-frontend-demo) is configured in `next.config.js` to proxy `/api/auth` to the the host setup using the environment varible `BACKEND_BASE_URL` in development set `export BACKEND_BASE_URL=http://localhost:3000` you will also need to set your `NEXTAUTH_URL` environment varible see https://next-auth.js.org/configuration/options for more information.
