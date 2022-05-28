import url from 'url';
import {
  AdminFileToWrite,
  BaseListTypeInfo,
  KeystoneConfig,
  KeystoneContext,
  AdminUIConfig,
  BaseKeystoneTypeInfo,
  SessionStrategy,
} from '@keystone-6/core/types';
import { getSession } from 'next-auth/react';
import { getToken } from 'next-auth/jwt';
import { Provider } from 'next-auth/providers';

import * as cookie from 'cookie';

import { Session } from 'next-auth';
import { nextConfigTemplate } from './templates/next-config';
// import * as Path from 'path';

import { AuthConfig, KeystoneOAuthConfig, AuthSessionStrategy } from './types';
import { getSchemaExtension } from './schema';
import { authTemplate } from './templates/auth';

/**
 * createAuth function
 *
 * Generates config for Keystone to implement standard auth features.
 */

export type { NextAuthProviders, KeystoneOAuthConfig } from './types';
export function createAuth<GeneratedListTypes extends BaseListTypeInfo>({
  autoCreate,
  cookies,
  identityField,
  listKey,
  keystonePath,
  pages,
  resolver,
  providers,
  sessionData,
  sessionSecret,
}: AuthConfig<GeneratedListTypes>) {
  // The protectIdentities flag is currently under review to see whether it should be
  // part of the createAuth API (in which case its use cases need to be documented and tested)
  // or whether always being true is what we want, in which case we can refactor our code
  // to match this. -TL

  const customPath = !keystonePath || keystonePath === '/' ? '' : keystonePath;
  /**
   * pageMiddleware
   *
   * Should be added to the ui.pageMiddleware stack.
   *
   * Redirects:
   *  - from the signin or init pages to the index when a valid session is present
   *  - to the init page when initFirstItem is configured, and there are no user in the database
   *  - to the signin page when no valid session is present
   */
  const pageMiddleware: AdminUIConfig<BaseKeystoneTypeInfo>['pageMiddleware'] = async ({
    context,
    isValidSession,
  }) => {
    const { req, session } = context;
    const pathname = url.parse(req?.url!).pathname!;

    if (isValidSession) {
      if (
        pathname === `${customPath}/api/auth/signin` ||
        (pages?.signIn && pathname.includes(pages?.signIn))
      ) {
        return { kind: 'redirect', to: `${customPath}` };
      }
      if (customPath !== '' && pathname === '/') {
        return { kind: 'redirect', to: `${customPath}` };
      }
      return;
    }
    if (
      pathname.includes('/_next/') ||
      pathname.includes('/api/auth/') ||
      (pages?.signIn && pathname.includes(pages?.signIn)) ||
      (pages?.error && pathname.includes(pages?.error)) ||
      (pages?.signOut && pathname.includes(pages?.signOut))
    ) {
      return;
    }
    if (!session && !pathname.includes(`${customPath}/api/auth/`)) {
      return {
        kind: 'redirect',
        to: pages?.signIn || `${customPath}/api/auth/signin`,
      };
    }
  };

  /**
   * getAdditionalFiles
   *
   * This function adds files to be generated into the Admin UI build. Must be added to the
   * ui.getAdditionalFiles config.
   *
   * The signin page is always included, and the init page is included when initFirstItem is set
   */
  const getAdditionalFiles = () => {
    const filesToWrite: AdminFileToWrite[] = [
      {
        mode: 'write',
        outputPath: 'pages/api/auth/[...nextauth].js',
        src: authTemplate({
          autoCreate,
          identityField,
          listKey,
          sessionData,
          sessionSecret,
        }),
      },
      {
        mode: 'write',
        outputPath: 'next.config.js',
        src: nextConfigTemplate({ keystonePath: customPath }),
      },
    ];
    return filesToWrite;
  };

  /**
   * publicAuthPages
   *
   * Must be added to the ui.publicPages config
   */
  const publicPages = [
    `${customPath}/api/__keystone_api_build`,
    `${customPath}/api/auth/csrf`,
    `${customPath}/api/auth/signin`,
    `${customPath}/api/auth/callback`,
    `${customPath}/api/auth/session`,
    `${customPath}/api/auth/providers`,
    `${customPath}/api/auth/signout`,
    `${customPath}/api/auth/error`,
  ];
  // TODO: Add Provider Types
  // @ts-ignore
  function addPages(provider: Provider) {
    const name = provider.id;
    publicPages.push(`${customPath}/api/auth/signin/${name}`);
    publicPages.push(`${customPath}/api/auth/callback/${name}`);
  }
  providers.map(addPages);

  /**
   * extendGraphqlSchema
   *
   * Must be added to the extendGraphqlSchema config. Can be composed.
   */
  const extendGraphqlSchema = getSchemaExtension({
    identityField,
    listKey,
  });

  /**
   * validateConfig
   *
   * Validates the provided auth config; optional step when integrating auth
   */
  const validateConfig = (keystoneConfig: KeystoneConfig) => {
    const listConfig = keystoneConfig.lists[listKey];
    if (listConfig === undefined) {
      const msg = `A createAuth() invocation specifies the list "${listKey}" but no list with that key has been defined.`;
      throw new Error(msg);
    }

    // TODO: Check if providers
    // TODO: Check other required commands/data

    // TODO: Check for String-like typing for identityField? How?
    // TODO: Validate that the identifyField is unique.
    // TODO: If this field isn't required, what happens if I try to log in as `null`?
    const identityFieldConfig = listConfig.fields[identityField];
    if (identityFieldConfig === undefined) {
      const identityFieldName = JSON.stringify(identityField);
      const msg = `A createAuth() invocation for the "${listKey}" list specifies ${identityFieldName} as its identityField but no field with that key exists on the list.`;
      throw new Error(msg);
    }
  };

  /**
   * withItemData
   *
   * Automatically injects a session.data value with the authenticated item
   */
  /* TODO:
  - [ ] We could support additional where input to validate item sessions (e.g an isEnabled boolean)
*/
  const withItemData = (
    _sessionStrategy: AuthSessionStrategy<Record<string, any>>
  ): AuthSessionStrategy<{ listKey: string; itemId: string; data: any }> => {
    const { get, ...sessionStrategy } = _sessionStrategy;
    return {
      ...sessionStrategy,
      start: async () => {
        return 'false';
      },
      get: async ({ req, createContext }) => {
        const sudoContext = createContext({ sudo: true });
        const pathname = url.parse(req?.url!).pathname!;
        let nextSession: Session;
        if (pathname.includes('/api/auth')) {
          return;
        }
        if (req.headers?.authorization?.split(' ')[0] === 'Bearer') {
          nextSession = (await getToken({
            req,
            secret: sessionSecret,
          })) as Session;
        } else {
          nextSession = (await getSession({ req })) as Session;
        }

        if (
          !nextSession ||
          !nextSession.listKey ||
          nextSession.listKey !== listKey ||
          !nextSession.itemId ||
          !sudoContext.query[listKey] ||
          !nextSession.itemId
        ) {
          return;
        }
        return {
          ...nextSession,
          data: nextSession.data,
          listKey: nextSession.listKey,
          itemId: nextSession.itemId,
        };
      },
      end: async ({ res, req }) => {
        const TOKEN_NAME =
          process.env.NODE_ENV === 'production'
            ? '__Secure-next-auth.session-token'
            : 'next-auth.session-token';
        res.setHeader(
          'Set-Cookie',
          cookie.serialize(TOKEN_NAME, '', {
            maxAge: 0,
            expires: new Date(),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
            // TODO: Update parse to URL
            domain: url.parse(req.url as string).hostname as string,
          })
        );
      },
    };
  };

  /**
   * withAuth
   *
   * Automatically extends config with the correct auth functionality. This is the easiest way to
   * configure auth for keystone; you should probably use it unless you want to extend or replace
   * the way auth is set up with custom functionality.
   *
   * It validates the auth config against the provided keystone config, and preserves existing
   * config by composing existing extendGraphqlSchema functions and ui config.
   */
  const withAuth = (keystoneConfig: KeystoneConfig): KeystoneOAuthConfig => {
    validateConfig(keystoneConfig);
    let { ui } = keystoneConfig;
    if (keystoneConfig.ui) {
      ui = {
        ...keystoneConfig.ui,
        publicPages: [...(keystoneConfig.ui.publicPages || []), ...publicPages],
        getAdditionalFiles: [...(keystoneConfig.ui?.getAdditionalFiles || []), getAdditionalFiles],
        pageMiddleware: async args =>
          (await pageMiddleware(args)) ?? keystoneConfig?.ui?.pageMiddleware?.(args),
        enableSessionItem: true,
        isAccessAllowed: async (context: KeystoneContext) => {
          const { req } = context;
          const pathname = url.parse(req?.url!).pathname!;

          // Allow nextjs scripts and static files to be accessed without auth
          if (pathname.includes('/_next/')) {
            return true;
          }

          // Allow keystone to access /api/__keystone_api_build for hot reloading
          if (
            process.env.NODE_ENV !== 'production' &&
            context.req?.url !== undefined &&
            new URL(context.req.url, 'http://example.com').pathname ===
              `${customPath}/api/__keystone_api_build`
          ) {
            return true;
          }

          return keystoneConfig.ui?.isAccessAllowed
            ? keystoneConfig.ui.isAccessAllowed(context)
            : context.session !== undefined;
        },
      };
    }

    if (!keystoneConfig.session) throw new TypeError('Missing .session configuration');
    const session = withItemData(keystoneConfig.session) as SessionStrategy<any>;

    const existingExtendGraphQLSchema = keystoneConfig.extendGraphqlSchema;
    return {
      ...keystoneConfig,
      ui,
      cookies,
      providers,
      pages,
      resolver,
      session,
      lists: {
        ...keystoneConfig.lists,
      },
      experimental: {
        ...keystoneConfig.experimental,
        generateNodeAPI: true,
      },
      extendGraphqlSchema: existingExtendGraphQLSchema
        ? schema => existingExtendGraphQLSchema(extendGraphqlSchema(schema))
        : extendGraphqlSchema,
    };
  };

  return {
    withAuth,
    // In the future we may want to return the following so that developers can
    // roll their own. This is pending a review of the use cases this might be
    // appropriate for, along with documentation and testing.
    // ui: { enableSessionItem: true, pageMiddleware, getAdditionalFiles, publicPages },
    // fields,
    // extendGraphqlSchema,
    // validateConfig,
  };
}
