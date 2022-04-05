import { BaseListTypeInfo, KeystoneConfig } from '@keystone-6/core/types';
import { CookiesOptions, PagesOptions } from 'next-auth';
import { Provider } from 'next-auth/providers';

export type NextAuthSession = { listKey: string; itemId: string; data: any };

export type NextAuthProviders = Provider[];

type KeytoneOAuthOptions = {
  providers: NextAuthProviders;
  pages?: Partial<PagesOptions>;
};
type NextAuthOptions = {
  cookies?: Partial<CookiesOptions>;
  resolver: any;
};

export type KeystoneOAuthConfig = KeystoneConfig &
  KeytoneOAuthOptions &
  NextAuthOptions;

export type AuthConfig<GeneratedListTypes extends BaseListTypeInfo> = {
  /** Auth Create users in Keystone DB from Auth Provider */
  autoCreate: boolean;
  /** Adds ability to customize cookie options, for example, to facilitate cross-subdomain functionality */
  cookies?: Partial<CookiesOptions>;
  /** The key of the list to authenticate users with */
  listKey: GeneratedListTypes['key'];
  /** The path of the field the identity is stored in; must be text-ish */
  identityField: GeneratedListTypes['fields'];
  /** Path for Keystone interface */
  keystonePath?: string;
  // Custom pages for different NextAuth events
  pages?: any; // TODO: Fix types
  /** Providers for Next Auth */
  providers: NextAuthProviders;
  /** Resolver for user to define their profile */
  resolver?: Function | undefined;
  /** Session data population */
  sessionData?: string | undefined;
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
