import url from 'url';
import {
  AdminFileToWrite,
  BaseListTypeInfo,
  KeystoneConfig,
  KeystoneContext,
  AdminUIConfig,
  SessionStrategy,
  BaseKeystoneTypeInfo,
} from '@keystone-6/core/types';
import { getSession } from 'next-auth/react';
import * as cookie from 'cookie';
import { nextConfigTemplate } from './templates/next-config';
// import * as Path from 'path';

import {
  AuthConfig,
  AuthGqlNames,
  KeystoneAuthConfig,
  NextAuthSession,
} from './types';
import { getSchemaExtension } from './schema';
import { authTemplate } from './templates/auth';

/**
 * createAuth function
 *
 * Generates config for Keystone to implement standard auth features.
 */

export type { NextAuthProviders, KeystoneAuthConfig } from './types';
export function createAuth<GeneratedListTypes extends BaseListTypeInfo>({
  listKey,
  identityField,
  sessionData,
  autoCreate,
  userMap,
  accountMap,
  profileMap,
  keystonePath,
  providers,
  sessionSecret,
}: AuthConfig<GeneratedListTypes>) {
  // The protectIdentities flag is currently under review to see whether it should be
  // part of the createAuth API (in which case its use cases need to be documented and tested)
  // or whether always being true is what we want, in which case we can refactor our code
  // to match this. -TL
  const gqlNames: AuthGqlNames = {
    // Core
    authenticateItemWithPassword: `authenticate${listKey}WithPassword`,
    ItemAuthenticationWithPasswordResult: `${listKey}AuthenticationWithPasswordResult`,
    ItemAuthenticationWithPasswordSuccess: `${listKey}AuthenticationWithPasswordSuccess`,
    ItemAuthenticationWithPasswordFailure: `${listKey}AuthenticationWithPasswordFailure`,
    // Initial data
    CreateInitialInput: `CreateInitial${listKey}Input`,
    createInitialItem: `createInitial${listKey}`,
  };

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
  const pageMiddleware: AdminUIConfig<BaseKeystoneTypeInfo>['pageMiddleware'] =
    async ({ context, isValidSession }) => {
      const { req, session } = context;
      const pathname = url.parse(req?.url!).pathname!;
      if (pathname === `${customPath}/api/__keystone_api_build`) {
        return;
      }
      if (isValidSession) {
        if (pathname === `${customPath}/api/auth/signin`) {
          return { kind: 'redirect', to: `${customPath}` };
        }
        if (customPath !== '' && pathname === '/') {
          return { kind: 'redirect', to: `${customPath}` };
        }
        return;
      }

      if (!session && !pathname.includes(`${customPath}/api/auth/`)) {
        return { kind: 'redirect', to: `${customPath}/api/auth/signin` };
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
          gqlNames,
          identityField,
          sessionData,
          listKey,
          autoCreate,
          userMap,
          accountMap,
          profileMap,
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
    `${customPath}/api/auth/csrf`,
    `${customPath}/api/auth/signin`,
    `${customPath}/api/auth/callback`,
    `${customPath}/api/auth/session`,
    `${customPath}/api/auth/providers`,
    `${customPath}/api/auth/signout`,
  ];
  function addPages(provider) {
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
    gqlNames,
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

    // TODO: Check for String-like typing for identityField? How?
    // TODO: Validate that the identifyField is unique.
    // TODO: If this field isn't required, what happens if I try to log in as `null`?
    const identityFieldConfig = listConfig.fields[identityField];
    if (identityFieldConfig === undefined) {
      const i = JSON.stringify(identityField);
      const msg = `A createAuth() invocation for the "${listKey}" list specifies ${i} as its identityField but no field with that key exists on the list.`;
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
    _sessionStrategy: SessionStrategy<Record<string, any>>
  ): SessionStrategy<NextAuthSession | undefined> => {
    const { get, ...sessionStrategy } = _sessionStrategy;
    return {
      ...sessionStrategy,
      get: async ({ req }) => {
        const pathname = url.parse(req?.url!).pathname!;
        if (pathname.includes('/api/auth')) {
          return;
        }
        const nextSession: unknown = await getSession({ req });
        if (nextSession) {
          return nextSession as NextAuthSession;
        }
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
            domain: url.parse(req.url).hostname,
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
  const withAuth = (keystoneConfig: KeystoneConfig): KeystoneAuthConfig => {
    validateConfig(keystoneConfig);
    let { ui } = keystoneConfig;
    if (keystoneConfig.ui) {
      ui = {
        ...keystoneConfig.ui,
        publicPages: [...(keystoneConfig.ui.publicPages || []), ...publicPages],
        getAdditionalFiles: [
          ...(keystoneConfig.ui?.getAdditionalFiles || []),
          getAdditionalFiles,
        ],
        pageMiddleware: async (args) =>
          (await pageMiddleware(args)) ??
          keystoneConfig?.ui?.pageMiddleware?.(args),
        enableSessionItem: true,
        isAccessAllowed: async (context: KeystoneContext) => {
          if (
            process.env.NODE_ENV !== 'production' &&
            context.req?.url !== undefined &&
            new URL(context.req.url, 'http://example.com').pathname ===
              `${customPath}/api/__keystone_api_build`
          ) {
            return true;
          }
          // Allow access to the adminMeta data from the /init path to correctly render that page
          // even if the user isn't logged in (which should always be the case if they're seeing /init)
          const headers = context.req?.headers;
          const host = headers
            ? headers['x-forwarded-host'] || headers.host
            : null;
          const thisUrl = headers?.referer
            ? new URL(headers.referer)
            : undefined;
          const accessingInitPage =
            thisUrl?.pathname === '/init' &&
            thisUrl?.host === host &&
            (await context.sudo().query[listKey].count({})) === 0;
          return (
            accessingInitPage ||
            (keystoneConfig.ui?.isAccessAllowed
              ? keystoneConfig.ui.isAccessAllowed(context)
              : context.session !== undefined)
          );
        },
      };
    }

    if (!keystoneConfig.session)
      throw new TypeError('Missing .session configuration');
    const session = withItemData(keystoneConfig.session);

    const existingExtendGraphQLSchema = keystoneConfig.extendGraphqlSchema;
    return {
      ...keystoneConfig,
      ui,
      session,
      providers,
      lists: {
        ...keystoneConfig.lists,
      },
      extendGraphqlSchema: existingExtendGraphQLSchema
        ? (schema) => existingExtendGraphQLSchema(extendGraphqlSchema(schema))
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
