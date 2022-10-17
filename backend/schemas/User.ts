import { list } from '@keystone-6/core';
import { text, relationship } from '@keystone-6/core/fields';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from '../access';

export const User = list({
  access: {
    operation: {
      ...allOperations(isSignedIn),
      create: () => true,
      // only people with the permission can delete themselves!
      // You can't delete yourself
      delete: permissions.canManageUsers,
    },
    filter: {
      query: rules.canManageUsers,
      update: rules.canManageUsers,
    },
  },
  ui: {
    // hide the backend UI from regular users
    hideCreate: args => !permissions.canManageUsers(args),
    hideDelete: args => !permissions.canManageUsers(args),
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true }, isIndexed: true }),
    subjectId: text({ isIndexed: 'unique' }),
    role: relationship({
      ref: 'Role.assignedTo',
    }),
  },
});
