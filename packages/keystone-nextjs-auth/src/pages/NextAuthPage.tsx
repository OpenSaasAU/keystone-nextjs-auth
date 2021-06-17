import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

import { gql, useMutation } from '@keystone-next/keystone/admin-ui/apollo';

//Need to bring in correct props
type NextAuthPageProps = {
    identityField: string;
    mutationName: string;
  };
export const getNextAuthPage = (props: NextAuthPageProps) => () => NextAuthPage({ ...props });

export default function NextAuthPage(props: NextAuthPageProps){
    return NextAuth({
        providers: [
            Providers.Auth0({
                clientId: process.env.AUTH0_CLIENT_ID || '',
                clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
                domain: process.env.AUTH0_DOMAIN || '',
            })
        ],
        callbacks: {
            async signIn(user, account, profile) {
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
                session.subject = token.sub;
                return Promise.resolve(session);
            },
            async jwt(token, user, account, profile, isNewUser) {
                return token;
            }
        }
    });
}