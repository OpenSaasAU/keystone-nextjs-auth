import NextAuth, { CookiesOptions, EventCallbacks, PagesOptions } from 'next-auth';
import type { KeystoneListsAPI } from '@keystone-6/core/types';
import { Provider } from 'next-auth/providers';
import { JWTOptions } from 'next-auth/jwt';
import { validateNextAuth } from '../lib/validateNextAuth';

type CoreNextAuthPageProps = {
  autoCreate: boolean;
  cookies?: Partial<CookiesOptions>;
  events?: Partial<EventCallbacks>;
  identityField: string;
  jwt?: Partial<JWTOptions>;
  listKey: string;
  pages?: Partial<PagesOptions>;
  providers?: Provider[];
  resolver?: (args: { user: any; profile: any; account: any }) => {
    [key: string]: boolean | string | number;
  };
  sessionData: string | undefined;
  sessionSecret: string;
};

type NextAuthGglProps = {
  mutationName?: string;
  query?: KeystoneListsAPI<any>;
};

export type NextAuthPageProps = CoreNextAuthPageProps & NextAuthGglProps;

export default function NextAuthPage(props: NextAuthPageProps) {
  const {
    autoCreate,
    cookies,
    events,
    identityField,
    jwt,
    listKey,
    pages,
    providers,
    query,
    resolver,
    sessionData,
    sessionSecret,
  } = props;

  if (!query) {
    console.error('NextAuthPage got no query.');
    return null;
  }

  if (!providers || !providers.length) {
    console.error('You need to provide at least one provider.');
    return null;
  }

  const list = query[listKey];
  const queryAPI = query[listKey];
  const protectIdentities = true;

  return NextAuth({
    cookies,
    providers,
    pages: pages || {},
    events: events || {},
    jwt: jwt || {},
    secret: sessionSecret,
    callbacks: {
      async signIn({ user, account, profile }) {
        let identity;
        if (typeof user.id === 'string') {
          identity = user.id;
        } else if (typeof user.id === 'number') {
          identity = user.id;
        } else {
          identity = 0;
        }
        const userInput = resolver ? await resolver({ user, account, profile }) : {};

        const result = await validateNextAuth(identityField, identity, protectIdentities, queryAPI);
        // ID
        const data: any = {
          [identityField]: identity,
          ...userInput,
        };

        if (!result.success) {
          if (!autoCreate) {
            console.log('`autoCreate` is set to `false`, skipping user auto-creation');
            return false;
          }
          console.log('`autoCreate` is set to `true`, auto-creating a new user');

          const createUser = await list
            .createOne({ data })
            .then(returned => {
              return { success: true, user: returned };
            })
            .catch(error => {
              console.log(error);
              throw new Error(error);
            });
          console.log('Created User', createUser);
          return createUser.success;
        }
        console.log('Data', data);

        const updateUser = await list
          .updateOne({ where: { id: result.item.id }, data })
          .then(returned => {
            return { success: true, user: returned };
          })
          .catch(error => {
            console.log(error);
            throw new Error(error);
          });
        return updateUser.success;
      },
      async redirect({ url }) {
        return url;
      },
      async session({ session, token }) {
        let returnSession = session;
        if (!token.itemId) {
          return { expires: '0' };
        } else {
          returnSession = {
            ...session,
            data: token.data,
            subject: token.sub,
            listKey: token.listKey as string,
            itemId: token.itemId as string,
          };
        }
        console.log('Session', returnSession);

        return returnSession;
      },
      async jwt({ token }) {
        const identity = token.sub as number | string;
        const result = await validateNextAuth(identityField, identity, protectIdentities, queryAPI);

        if (!result.success) {
          token.itemId = null;
        } else {
          token.itemId = result.item.id;
          const data = await query[listKey].findOne({
            where: { id: token.itemId },
            query: sessionData || 'id',
          });
          token.data = data;
        }
        const returnToken = {
          ...token,
          subject: token.sub,
          listKey,
        };

        return returnToken;
      },
    },
  });
}

export const getNextAuthPage = (props: NextAuthPageProps) => () => NextAuthPage({ ...props });
