---
"@opensaas/keystone-nextjs-auth": major
---

Move `userMap` `accountMap` and `userMap` into a resolver function - `resolver` function takes in `{user,account,profile}` and returns a object that is passed in to create the identity
