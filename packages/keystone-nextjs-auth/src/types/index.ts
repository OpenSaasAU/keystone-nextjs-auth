import type { ServerResponse, IncomingMessage } from 'http';
import type { NextRequest } from 'next/server';
import { Provider } from 'next-auth/providers';
import { CookiesOptions, PagesOptions } from 'next-auth';
import { BaseListTypeInfo, KeystoneConfig, CreateContext } from '@keystone-6/core/types';

type NextAuthResponse = IncomingMessage & NextRequest;

export declare type AuthSessionStrategy<StoredSessionData> = {
  start: (args: {
    res: ServerResponse;
    data: any;
    createContext: CreateContext;
  }) => Promise<string>;
  end: (args: {
    req: IncomingMessage;
    res: ServerResponse;
    createContext: CreateContext;
  }) => Promise<void>;
  get: (args: {
    req: NextAuthResponse;
    createContext: CreateContext;
  }) => Promise<StoredSessionData | undefined>;
};

export type NextAuthProviders = Provider[];

type KeytoneOAuthOptions = {
  providers: NextAuthProviders;
  pages?: Partial<PagesOptions>;
};
type NextAuthOptions = {
  cookies?: Partial<CookiesOptions>;
  resolver: any;
};

export type KeystoneOAuthConfig = KeystoneConfig & KeytoneOAuthOptions & NextAuthOptions;

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
  pages?: Partial<PagesOptions>;
  /** Providers for Next Auth */
  providers: NextAuthProviders;
  /** Resolver for user to define their profile */
  resolver?: (args: { user: any; profile: any; account: any }) => Promise<{
    [key: string]: boolean | string | number;
  }>;
  /** Session data population */
  sessionData?: string | undefined;
  /** Next-Auth Session Secret */
  sessionSecret: string;
};

export type AuthTokenRequestErrorCode = 'IDENTITY_NOT_FOUND' | 'MULTIPLE_IDENTITY_MATCHES';

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
