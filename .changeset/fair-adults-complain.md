---
"@opensaas-keystone/next-auth-backend": major
"@opensaas/keystone-nextjs-auth": major
---

map publicPages to providers to allow the auto addition of callback and signin URLs to the `publicPages` array in keystone. This requires providers to mvoe to the `createAuth` configuration which probably make more sense anyway. See readme for new configuration.
