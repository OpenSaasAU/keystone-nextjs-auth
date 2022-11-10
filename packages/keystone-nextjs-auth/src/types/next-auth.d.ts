import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends JWT {
    user?: any;
    listKey?: string;
    itemId?: string;
    subject?: string | number | null | undefined;
    expires?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    data?: any | undefined;
    subject?: string | number | null | undefined;
    listKey?: string;
    itemId?: string;
    name?: string | null | undefined;
    email?: string | null | undefined;
    picture?: string | null | undefined;
    sub?: string | number | null | undefined;
    expires?: string | null | undefined;
  }
}
