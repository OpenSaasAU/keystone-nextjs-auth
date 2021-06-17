/* @jsx jsx */

import { useState, FormEvent, useRef, useEffect } from 'react';

import { jsx, H1, Stack } from '@keystone-ui/core';


  
export const getSigninPage = () => () => <SigninPage />;

export const SigninPage = () => {
    return (
      <Stack>
      <H1>Sign In</H1>
    </Stack>
  )
};