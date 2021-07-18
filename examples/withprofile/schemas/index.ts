import { createSchema } from '@keystone-next/keystone/schema';
import { Role } from './Role';
import { User } from './User';

export const lists = createSchema({
  Role,
  User,
});
