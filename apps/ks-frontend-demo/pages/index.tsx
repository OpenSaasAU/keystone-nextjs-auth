/* eslint-disable react/function-component-definition */
import { Container, Button } from 'react-bootstrap';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useUser } from '../lib/useUser';

export default function SignupPage() {
  const user = useUser();

  const { data, status } = useSession();
  if (status === 'loading') return <Container>Loading... </Container>;

  return (
    <Container>
      {user && <p>Authenticated Item from Keystone Says: {user.name}</p>}
      {!user && <p>No User</p>}
      {data && (
        <>
          <p>
            Welcome {data.user.name}, we have your Session email as{' '}
            {data.user.email}
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
      {!data && (
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
