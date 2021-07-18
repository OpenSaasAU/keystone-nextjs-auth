# Keystone next auth
This package adds a profile page to Keystone-6 for Auth0.
This utalises the `@opensaas/keystone-nextjs-auth` package but add a page, configured via `profilePageName` where the current logged in users profile is displayed.

## Contents

- [About](#about)
- [Adding to your project](#adding-to-your-project)
- [Configuration](#configuration)
- [Contributing](#contributing)

## About
This uses NextAuth.js (https://next-auth.js.org/) project to add social auth and a profile page to Keystone-6 (https://keystonejs.com/). TODO: The roadmap for this package is to then sync information back to auth0 and include account linking via the management API (https://auth0.com/docs/users/user-account-linking).

## Adding to your project

Add package by `yarn add @opensaas/keystone-auth0-profile` then add the following to your `keystone.ts`:

Add import...

```javascript
import {
  createAuth,
  nextAuthProviders as Providers,
} from '@opensaas/keystone-auth0-profile';
```

Add Providers

```javascript
export const providers = [
  Providers.Auth0({
    clientId: process.env.AUTH0_CLIENT_ID || 'Auth0ClientID',
    clientSecret: process.env.AUTH0_CLIENT_SECRET || 'Auth0ClientSecret',
    domain: process.env.AUTH0_DOMAIN || 'opensaas.au.auth0.com',
  }),
];
```
for Provider configuration see https://next-auth.js.org/configuration/providers.

Add your Profile and Auth configuration

```javascript
const profile = createProfile({
  listKey: 'User',
  identityField: 'subjectId',
  sessionData: `id name email`,
  autoCreate: true,
  userMap: { subjectId: 'id', name: 'name' },
  accountMap: {},
  profileMap: { email: 'email' },
  profilePageName: 'me',
});
```
Wrap your keystone config in `profile.withProfile`
```javascript
export default profile.withProfile(
  config({
    server: {},
    db: {},
    ui: {},
    lists,
    ...
  });
```

## Configuration
Provider configuration see https://next-auth.js.org/configuration/providers.
For Keystone-6 Configuration see https://keystonejs.com/
for example see the example [backend](./backend)

-  listKey - the list for authentication (generally `'User'`)
-  identityField - The field that stores the identity/subjectId in keystone (generally `'subjectId'`)
-  sessionData - Data to be stored in the session ( something like `'id name email'`),
-  autoCreate - boolean to autocreate a user when they log in
-  userMap: `key:value` pairs that define what is copied from the User object returned from NextAuth in the SignIn callback (https://next-auth.js.org/configuration/callbacks#sign-in-callback) Left side is Keystone side, right is what comes from NextAuth eg: `{ subjectId: 'id', name: 'name' }`
-  accountMap - As Above but for the Account object
-  profileMap - As Above but for the Profile object

## Contributing
If you want to run this package locally
After cloning run `yarn install` and either:
- `yarn dev` to run both the frontend and backend or
- `yarn dev:backend` for just the backend

The [Demo App](./apps/ks-frontend-demo) is configured in `next.config.js` to proxy `/api/auth` to the the host setup using the environment varible `BACKEND_BASE_URL` in development set `export BACKEND_BASE_URL=http://localhost:3000` you will also need to set your `NEXTAUTH_URL` environment varible see https://next-auth.js.org/configuration/options for more information.