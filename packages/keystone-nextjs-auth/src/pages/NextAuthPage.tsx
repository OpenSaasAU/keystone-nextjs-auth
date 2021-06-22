import NextAuth from 'next-auth';
import { Provider } from 'next-auth/providers'

//Need to bring in correct props
type NextAuthPageProps = {
    identityField: string;
    mutationName: string;
    providers: Provider[];
  };

export const getNextAuthPage = (props: NextAuthPageProps) => () => NextAuthPage({ ...props });

export default function NextAuthPage(props: NextAuthPageProps){

    const providers = props.providers;
    
    return NextAuth({
        providers,
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
                console.log(session);
                
                session.subject = token.sub;
                return Promise.resolve(session);
            },
            async jwt(token, user, account, profile, isNewUser) {
                return token;
            }
        }
    });
}