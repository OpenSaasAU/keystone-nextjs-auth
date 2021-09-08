import { createSchema } from '@keystone-next/keystone';
import { Role } from './Role';
import { User } from './User';

export const lists = createSchema({
  Role,
  User,
});
