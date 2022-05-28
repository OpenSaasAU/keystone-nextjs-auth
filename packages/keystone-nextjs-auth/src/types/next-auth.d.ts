import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  type JWT =
    | {
        data?: any;
        subject?: string | null | undefined;
        listKey?: string | null | undefined;
        itemId?: string | null | undefined;
        name?: string | null | undefined;
        email?: string | null | undefined;
        picture?: string | null | undefined;
        sub?: string | null | undefined;
        expires?: string | null | undefined;
      }
    | undefined;
  type Session = JWT | undefined;
}
