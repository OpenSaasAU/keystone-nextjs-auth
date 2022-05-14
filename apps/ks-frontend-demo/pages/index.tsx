/* eslint-disable react/function-component-definition */
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useUser, CURRENT_USER_QUERY } from '../lib/useUser';
import { initializeApollo } from '../lib/apolloClient';

export async function getServerSideProps(context: any) {
  console.log(context?.req?.headers);

  const apolloClient = initializeApollo(context?.req?.headers);

  const { data: user } = await apolloClient.query({
    query: CURRENT_USER_QUERY,
  });
  console.log('User', user);

  return { props: { user } };
}

export default function SignupPage({ ...props }) {
  const user = useUser();
  const ssrUser = props.user.authenticatedItem;

  const { data, status } = useSession();
  if (status === 'loading') return <Container>Loading... </Container>;

  return (
    <Container>
      {user && (
        <p>
          Authenticated Item from Keystone Says:
          {user.name}
          Server Side Props says:
          {ssrUser.name}
        </p>
      )}
      {!user && <p>No User</p>}
      {data && (
        <>
          <p>
            Welcome
            {data?.user?.name}, we have your Session email as
            {data?.user?.email}
          </p>
          {user && (
            <p>
              And your user email as
              {user.email}
            </p>
          )}
          <Button
            onClick={() =>
              signOut({
                callbackUrl: `${window.location.origin}`,
              })
            }
          >
            Sign Out
          </Button>
          <Link href="/admin">
            <Button>Admin</Button>
          </Link>
        </>
      )}
      {!data && (
        <>
          Not signed in
          <br />
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
