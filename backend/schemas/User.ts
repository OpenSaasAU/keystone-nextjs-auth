import { list } from '@keystone-next/keystone';
import { text, relationship } from '@keystone-next/keystone/fields';
import { permissions, rules } from '../access';

export const User = list({
  access: {
    create: () => true,
    read: rules.canManageUsers,
    update: rules.canManageUsers,
    // only people with the permission can delete themselves!
    // You can't delete yourself
    delete: permissions.canManageUsers,
  },
  ui: {
    // hide the backend UI from regular users
    hideCreate: (args) => !permissions.canManageUsers(args),
    hideDelete: (args) => !permissions.canManageUsers(args),
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
