import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface JWT {
    data?: any | undefined;
    subject?: string | undefined;
    listKey?: string;
    itemId?: string | undefined;
    name?: string | null | undefined;
    email?: string | null | undefined;
    picture?: string | null | undefined;
    sub?: string | null | undefined;
    expires?: string | null | undefined;
  }
  interface Session extends JWT {
    user?: any;
  }
}
