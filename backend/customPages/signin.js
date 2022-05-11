/** @jsxRuntime classic */
/** @jsx jsx */
/* eslint-disable import/no-extraneous-dependencies */
import { jsx, H1, Stack, VisuallyHidden, Center, Box, useTheme } from '@keystone-ui/core';
import { useRouter } from 'next/dist/client/router';

import { Button } from '@keystone-ui/button';
import { ReactNode } from 'react';

import { signIn, getProviders } from 'next-auth/react';

const SigninContainer = ({ children, title }) => {
  const { colors, shadow } = useTheme();
  return (
    <div>
      <Center
        css={{
          minWidth: '100vw',
          minHeight: '100vh',
          backgroundColor: colors.backgroundMuted,
        }}
        rounding="medium"
      >
        <Box
          css={{
            background: colors.background,
            width: 600,
            boxShadow: shadow.s100,
          }}
          margin="medium"
          padding="xlarge"
          rounding="medium"
        >
          {children}
        </Box>
      </Center>
    </div>
  );
};
export const getSigninPage = props => () => <SigninPage {...props} />;

export default function SigninPage(props) {
  const { csrfToken, providers, callbackUrl, theme, email, error: errorType } = props;
  const router = useRouter();
  // We only want to render providers

  const { error } = router.query;
  console.log('error', error);

  if (error) {
    return (
      <SigninContainer title="Keystone - Sign In">
        <H1>Sign In - Error</H1>
        <p>Oops, something went wrong. Please try again.</p>
        <p>{error}</p>
      </SigninContainer>
    );
  }

  return (
    <SigninContainer title="Keystone - Sign In">
      <H1>Sign In</H1>
      {Object.values(providers).map(provider => (
        <div key={provider.name}>
          <Button onClick={() => signIn(provider.id, { callbackUrl: '/admin' })}>
            Sign in with
            {provider.name}
          </Button>
        </div>
      ))}
    </SigninContainer>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
