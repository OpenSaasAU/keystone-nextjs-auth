import { relationship, text } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
import { permissions } from '../access';
import { permissionFields } from './permissionFields';

export const Role = list({
  access: {
    operation: {
      create: permissions.canManageRoles,
      query: permissions.canManageRoles,
      update: permissions.canManageRoles,
      delete: permissions.canManageRoles,
    },
  },
  ui: {
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    isHidden: (args) => !permissions.canManageRoles(args),
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    ...permissionFields,
    assignedTo: relationship({
      ref: 'User.role',
      many: true,
      ui: {
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
