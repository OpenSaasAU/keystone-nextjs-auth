import { list } from '@keystone-next/keystone/schema';
import { text, relationship } from '@keystone-next/fields';
import { permissions, rules } from '../access';

export const User = list({
  access: {
    create: () => false,
    read: rules.canManageUsers,
    update: rules.canManageUsers,
    // only people with the permission can delete themselves!
    // You can't delete yourself
    delete: () => false,
  },
  ui: {
    // hide the backend UI from regular users
    hideCreate: () => true,
    hideDelete: () => true,
  },
  fields: {
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    subjectId: text({ isUnique: true }),
    role: relationship({
      ref: 'Role.assignedTo',
    }),
  },
});
