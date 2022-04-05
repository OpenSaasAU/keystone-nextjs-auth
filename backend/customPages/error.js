/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, H1, Stack, VisuallyHidden, Center, Box, useTheme } from '@keystone-ui/core';
import { useRouter } from 'next/dist/client/router';

import { Button } from '@keystone-ui/button';
import { ReactNode } from 'react';

import { signIn } from 'next-auth/react';


const SigninContainer = ({ children, title }) => {
  const { colors, shadow } = useTheme();
  return (
    <div>
      <head>
        <title>{title || 'Keystone'}</title>
      </head>
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
export const getErrorPage = (props) => () => <ErrorPage {...props} />;

export default function ErrorPage() {

  const router = useRouter();

  const { error } = router.query;
  console.log('error', error);

  if (error) {
    return (
      <SigninContainer title="Keystone - Sign In">
        <H1>Sign In - Error</H1>
        <p>Oops, something went wrong. Please try again.</p>
        <p>{error}</p>
      </SigninContainer>
    )
  }

  return (
    <SigninContainer title="Keystone - Sign In">
      <H1>Sign In</H1>
      <Button
        onClick={() =>
          signIn('auth0', {
            callbackUrl: `${window.location.origin}`,
          })
        }>
              Sign In with Auth0
            </Button>
    </SigninContainer>
  )
}
