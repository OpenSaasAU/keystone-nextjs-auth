import NextAuth from 'next-auth';
import { Provider } from 'next-auth/providers'
import type { KeystoneListsAPI } from '@keystone-next/types';
import { validateNextAuth }from '../lib/validateNextAuth';

//Need to bring in correct props
type NextAuthPageProps = {
    identityField: string;
    mutationName: string;
    providers: Provider[];
    lists: KeystoneListsAPI<any>;
    sessionData: string;
    listKey: string;
  };


export const getNextAuthPage = (props: NextAuthPageProps) => () => NextAuthPage({ ...props });

export default function NextAuthPage(props: NextAuthPageProps){
    const { providers, lists, identityField, sessionData, listKey } = props;
    const list = lists[listKey];
    const itemAPI = lists[listKey];
    const protectIdentities = true;
    
      
    return NextAuth({
        providers,
        callbacks: {
            async signIn(user, account, profile) {
                const ksUser = await lists.[listKey].findMany({ query: sessionData });
                console.log(ksUser);
                // TODO Check if the user is allowed access...
                // TODO Auto add user to KeystoneDB?
                const isUser = true;
                if (isUser){
                    return true;
                } else {
                    return false;
                }
            },
            async redirect(url, baseUrl) {
                return url;
            },
            async session(session: any, token: any) {
                // TODO: Need to somehow add the Keystone SessionData to the next-auth session
                const identity = token.sub;
                const result = await validateNextAuth(
                    list,
                    identityField,
                    identity,
                    protectIdentities,
                    itemAPI
                  );
      
                  if (!result.success){
                    return;
                  }

                const data = await lists[listKey].findOne({
                    where: { id: result.item.id },
                    query: sessionData || 'id',
                  });
                
                session = {...session, data, subject: token.sub, listKey, itemId: result.item.id.toString()};
                
                return Promise.resolve(session);
            },
            async jwt(token, user, account, profile, isNewUser) {
                return token;
            }
        }
    });
}