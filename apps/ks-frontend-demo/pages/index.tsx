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
          You are signed in as <strong>{user.email}</strong><br />
          AuthenticatedItem from Keystone GraphQL says: {' '}
          {user.name}
          Server Side Props also from Keystone GraphQL says: {' '}
          {ssrUser.name}
        </p>
      )}
      {!user && <p>No User</p>}
      {data && (
        <>
          <p>Your email stored in your NextAuthjs Session as: &quot;{data?.user?.email}&quot;</p>
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
            <Button style={{ float: 'right' }} >Keystone Admin</Button>
          </Link>
        </>
      )}
      {!data && (
        <>
          You are not currnetly signed in. Please sign in to get started.
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
      <p>This Demo Sign In flow uses Auth0 to manage users and social authentication</p>
      <p>For details on how to set up Social Auth on Keystone see our <a href="https://github.com/OpensaasAU/keystone-nextjs-auth/" rel="noopener" target="_blank">Github Repo</a></p>
    </Container>
  );
}
