/* eslint-disable default-case */
import {
  AuthTokenRedemptionErrorCode,
  AuthTokenRequestErrorCode,
  NextAuthErrorCode,
} from '../types';

export function getPasswordAuthError({
  identityField,
  secretField,
  code,
  itemPlural,
  itemSingular,
}: {
  identityField: string;
  secretField: string;
  itemSingular: string;
  itemPlural: string;
  code: NextAuthErrorCode;
}): string {
  switch (code) {
    case 'FAILURE':
      return 'Authentication failed.';
    case 'IDENTITY_NOT_FOUND':
      return `The ${identityField} value provided didn't identify any ${itemPlural}.`;
    case 'SUBJECT_NOT_FOUND':
      return `The ${itemSingular} identified has no ${secretField} set so can not be authenticated.`;
    case 'MULTIPLE_IDENTITY_MATCHES':
      return `The ${identityField} value provided identified more than one ${itemSingular}.`;
  }
}

export function getAuthTokenErrorMessage({
  identityField,
  code,
  itemPlural,
  itemSingular,
}: {
  identityField: string;
  itemSingular: string;
  itemPlural: string;
  code: AuthTokenRedemptionErrorCode | AuthTokenRequestErrorCode;
}): string {
  switch (code) {
    case 'FAILURE':
      return 'Auth token redemption failed.';
    case 'IDENTITY_NOT_FOUND':
      return `The ${identityField} value provided didn't identify any ${itemPlural}.`;
    case 'MULTIPLE_IDENTITY_MATCHES':
      return `The ${identityField} value provided identified more than one ${itemSingular}.`;
    case 'TOKEN_NOT_SET':
      return `The ${itemSingular} identified has no auth token of this type set.`;
    case 'TOKEN_MISMATCH':
      return 'The auth token provided is incorrect.';
    case 'TOKEN_EXPIRED':
      return 'The auth token provided has expired.';
    case 'TOKEN_REDEEMED':
      return 'Auth tokens are single use and the auth token provided has already been redeemed.';
  }
}
