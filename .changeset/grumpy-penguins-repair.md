---
"@opensaas/keystone-nextjs-auth": major
---

Upgrade to next-authv4 see https://next-auth.js.org/getting-started/upgrade-v4 for more info.

BREAKING CHANGE:
`sessionSecret` now required in `createAuth`

`Providers` now under `@opensaas/keystone-nextjs-auth/providers/` ie `import Auth0 from '@opensaas/keystone-nextjs-auth/providers/auth0';` these can also be imported from next-auth by `import Auth0 from 'next-auth/providers/auth0';` if preferred.
