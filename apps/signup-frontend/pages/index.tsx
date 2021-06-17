import { Container, Button } from 'react-bootstrap';
import { signIn, signOut, useSession } from 'next-auth/client';

export default function SignupPage() {
  const [session, loading] = useSession();
  if (loading) return <Container>Loading... </Container>;
  return (
    <Container>
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
            Sign in
          </Button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <Button
            onClick={() =>
              signOut({
                callbackUrl: `${window.location.origin}`,
              })
            }
          >
            Sign out
          </Button>
        </>
      )}
    </Container>
  );
}
