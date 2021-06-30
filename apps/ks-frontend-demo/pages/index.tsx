import { Container, Button } from 'react-bootstrap';
import getConfig from 'next/config';
import { useUser } from '../lib/useUser';

export default function SignupPage() {
  const user = useUser();

  const { publicRuntimeConfig } = getConfig();

  return (
    <Container>
      {user && (
        <p>
          Welcome {user.name}, we have you email as {user.email}
        </p>
      )}
      {!user && (
        <>
          Not signed in <br />
          <form
            action={`${publicRuntimeConfig.backendBaseUrl}/api/auth/signin/auth0`}
            method="POST"
          >
            <input
              type="hidden"
              name="callbackUrl"
              value={publicRuntimeConfig.publicUrl}
            />
            <Button type="submit">login Auth0</Button>
          </form>
        </>
      )}
    </Container>
  );
}
