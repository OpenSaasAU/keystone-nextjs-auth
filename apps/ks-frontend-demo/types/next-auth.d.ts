import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    itemId: string;
    listKey?: string;
    subject?: string | number | null | undefined;
    data: {
      name: string;
      email: string;
      id: string;
    };
  }
}
