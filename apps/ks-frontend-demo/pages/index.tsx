import { Container, Button } from 'react-bootstrap';
import { signIn, signOut, useSession } from 'next-auth/client';
import { useUser } from '../lib/useUser';

export default function SignupPage() {
  const user = useUser();

  const [session, loading] = useSession();
  if (loading) return <Container>Loading... </Container>;

  return (
    <Container>
      {session && (
        <>
          <p>
            Welcome {session.user.name}, we have your Session email as{' '}
            {session.user.email}
          </p>
          {user && <p>And your user email as {user.email}.</p>}
          <Button
            onClick={() =>
              signOut({
                callbackUrl: `${window.location.origin}`,
              })
            }
          >
            Sign Out
          </Button>
        </>
      )}
      {!session && (
        <>
          Not signed in <br />
          <Button
            onClick={() =>
              signIn('auth0', {
                callbackUrl: `${window.location.origin}`,
              })
            }
          >
            Sign In
          </Button>
        </>
      )}
    </Container>
  );
}
