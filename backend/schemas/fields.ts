import { checkbox } from '@keystone-6/core/fields';

export const permissionFields = {
  canManageProducts: checkbox({
    defaultValue: false,
    label: 'User can Update and delete any product',
  }),
  canSeeOtherUsers: checkbox({
    defaultValue: false,
    label: 'User can query other users',
  }),
  canManageUsers: checkbox({
    defaultValue: false,
    label: 'User can Edit other users',
  }),
  canManageRoles: checkbox({
    defaultValue: false,
    label: 'User can CRUD roles',
  }),
  canManageCart: checkbox({
    defaultValue: false,
    label: 'User can see and manage cart and cart items',
  }),
  canManageOrgs: checkbox({
    defaultValue: false,
    label: 'User can see and manage Organisations',
  }),
};

export type Permission = keyof typeof permissionFields;

export const permissionsList: Permission[] = Object.keys(
  permissionFields
) as Permission[];
