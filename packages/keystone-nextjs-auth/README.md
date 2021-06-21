# Keystone next auth
See `/backend/keystone.ts` for example...

This package enables the adition of social auth to keystone-next.
Backend and apps/signup-frontend give examples of how to use it...
You will need to setup the following environment varibles
```
export AUTH0_DOMAIN=opensaas.au.auth0.com
export AUTH0_CLIENT_ID=<Client_ID>
export AUTH0_CLIENT_SECRET=<Client_Secret>
export NEXTAUTH_URL=http://localhost:3000
```
You can also confiigure the Auth providers in `keystone.ts` by adding a new provider to the Array
```
const auth = createAuth({
  listKey: 'User',
  identityField: 'subjectId',
  sessionData: `id name email`,
  providers: [
    {
    name: 'Auth0',
    config: {
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
      domain: process.env.AUTH0_DOMAIN || '',
      },
    },
    ],
});
```
See https://next-auth.js.org/configuration/providers for available providers. Currently only options that have a `string` type are configurable.