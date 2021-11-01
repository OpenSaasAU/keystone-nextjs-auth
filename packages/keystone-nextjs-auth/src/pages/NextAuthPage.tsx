import NextAuth from 'next-auth';
import { Provider } from 'next-auth/providers';
import type { KeystoneListsAPI } from '@keystone-next/keystone/types';
import { validateNextAuth } from '../lib/validateNextAuth';

// Need to bring in correct props
type NextAuthPageProps = {
  identityField: string;
  mutationName: string;
  providers: Provider[];
  query: KeystoneListsAPI<any>;
  sessionData: string;
  listKey: string;
  autoCreate: boolean;
  userMap: any;
  accountMap: any;
  profileMap: any;
};

export default function NextAuthPage(props: NextAuthPageProps) {
  const {
    providers,
    query,
    identityField,
    sessionData,
    listKey,
    autoCreate,
    userMap,
    accountMap,
    profileMap,
  } = props;
  const list = query[listKey];
  const queryAPI = query[listKey];
  const protectIdentities = true;

  return NextAuth({
    providers,
    callbacks: {
      async signIn(user, account, profile) {
        let identity;
        if (typeof user.id === 'string') {
          identity = user.id;
        } else if (typeof user.id === 'number') {
          identity = user.id;
        }
        const result = await validateNextAuth(
          list,
          identityField,
          identity,
          protectIdentities,
          queryAPI
        );
        const data = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const key in userMap) {
          if (Object.prototype.hasOwnProperty.call(userMap, key)) {
            data[key] = user[userMap[key]];
          }
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const key in accountMap) {
          if (Object.prototype.hasOwnProperty.call(accountMap, key)) {
            data[key] = account[accountMap[key]];
          }
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const key in profileMap) {
          if (Object.prototype.hasOwnProperty.call(profileMap, key)) {
            data[key] = profile[profileMap[key]];
          }
        }

        if (!result.success) {
          if (!autoCreate) {
            console.log('False');
            return false;
          }
          console.log('Create User');

          await list
            .createOne({ data })
            .then((returned) => {
              console.log(returned);

              return true;
            })
            .catch((error) => {
              console.log(error);

              throw new Error(error);
            });
        } else {
          // await list.updateOne({where: {id: result.item.id}, data});
          return result.success;
        }
      },
      async redirect(url, baseUrl) {
        return url;
      },
      async session(session: any, token: any) {
        console.log('session:', session);
        const returnSession = {
          ...session,
          data: token.data,
          subject: token.sub,
          listKey: token.listKey,
          itemId: token.itemId,
        };
        return returnSession;
      },
      async jwt(token, user, account, profile, isNewUser) {
        console.log('account:', account);

        const identity = token.sub;
        if (!token.itemId) {
          const result = await validateNextAuth(
            list,
            identityField,
            identity,
            protectIdentities,
            queryAPI
          );

          if (!result.success) {
            return;
          }

          const data = await query[listKey].findOne({
            where: { id: result.item.id },
            query: sessionData || 'id',
          });
          const returnToken = {
            ...token,
            data,
            subject: token.sub,
            listKey,
            itemId: result.item.id.toString(),
          };

          return returnToken;
        }
        return token;
      },
    },
  });
}

export const getNextAuthPage = (props: NextAuthPageProps) => () =>
  NextAuthPage({ ...props });
