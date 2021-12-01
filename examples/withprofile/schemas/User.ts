import { list } from '@keystone-6/core';
import { text, relationship } from '@keystone-6/core/fields';
import { permissions, rules } from '../access';

export const User = list({
  access: {
    operation: {
      create: () => false,
      read: rules.canManageUsers,
      update: rules.canManageUsers,
      // only people with the permission can delete themselves!
      // You can't delete yourself
      delete: () => false,
    },
  },
  ui: {
    // hide the backend UI from regular users
    hideCreate: () => true,
    hideDelete: () => true,
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    subjectId: text({ isIndexed: 'unique' }),
    role: relationship({
      ref: 'Role.assignedTo',
    }),
  },
});
