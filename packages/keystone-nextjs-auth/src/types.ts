import { BaseListTypeInfo, KeystoneConfig } from '@keystone-6/core/types';
import { Provider } from 'next-auth/providers';

export type AuthGqlNames = {
  CreateInitialInput: string;
  createInitialItem: string;
  authenticateItemWithPassword: string;
  ItemAuthenticationWithPasswordResult: string;
  ItemAuthenticationWithPasswordSuccess: string;
  ItemAuthenticationWithPasswordFailure: string;
};

export type NextAuthSession = { listKey: string; itemId: string; data: any };

export type NextAuthProviders = Provider[];

type KeytoneAuthProviders = {
  providers: NextAuthProviders;
};

export type KeystoneAuthConfig = KeystoneConfig & KeytoneAuthProviders;

export type AuthConfig<GeneratedListTypes extends BaseListTypeInfo> = {
  /** The key of the list to authenticate users with */
  listKey: GeneratedListTypes['key'];
  /** The path of the field the identity is stored in; must be text-ish */
  identityField: GeneratedListTypes['fields'];
  /** Session data population */
  sessionData?: string;
  /** Auth Create users in Keystone DB from Auth Provider */
  autoCreate: boolean;
  /** Map User in next-auth to item */
  userMap: any;
  /** Map Account in next-auth to item */
  accountMap: any;
  /** Map Profile in next-auth to item */
  profileMap: any;
  /** Path for Keystone interface */
  keystonePath?: string;
  /** Providers for Next Auth */
  providers: NextAuthProviders;
  /** Next-Auth Session Secret */
  sessionSecret: string;
};

export type AuthTokenRequestErrorCode =
  | 'IDENTITY_NOT_FOUND'
  | 'MULTIPLE_IDENTITY_MATCHES';

export type PasswordAuthErrorCode =
  | AuthTokenRequestErrorCode
  | 'FAILURE' // Generic
  | 'SECRET_NOT_SET'
  | 'SECRET_MISMATCH';

export type NextAuthErrorCode =
  | AuthTokenRequestErrorCode
  | 'FAILURE' // Generic
  | 'SUBJECT_NOT_FOUND';

export type AuthTokenRedemptionErrorCode =
  | AuthTokenRequestErrorCode
  | 'FAILURE' // Generic
  | 'TOKEN_NOT_SET'
  | 'TOKEN_MISMATCH'
  | 'TOKEN_EXPIRED'
  | 'TOKEN_REDEEMED';
