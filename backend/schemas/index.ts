import { Role } from './Role';
import { User } from './User';
import { createSchema } from '@keystone-next/keystone/schema';


export const lists = createSchema({
        Role,
        User,
    });