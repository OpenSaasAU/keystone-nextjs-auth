import { nextConfigTemplate } from './templates/next-config';
import url from 'url';
//import * as Path from 'path';
import {
  AdminFileToWrite,
  BaseGeneratedListTypes,
  KeystoneConfig,
  KeystoneContext,
  AdminUIConfig,
  SessionStrategy,
} from '@keystone-next/types';
import { password, timestamp } from '@keystone-next/fields';

import { getSession } from 'next-auth/client';
import { validateNextAuth } from './lib/validateNextAuth';

import { AuthConfig, AuthGqlNames } from './types';
import { getSchemaExtension } from './schema';
import { authTemplate } from './templates/auth';
import Providers from 'next-auth/providers';

export const nextAuthProviders = Providers;
/**
 * createAuth function
 *
 * Generates config for Keystone to implement standard auth features.
 */

export function createAuth<GeneratedListTypes extends BaseGeneratedListTypes>({
  listKey,
  identityField,
  sessionData,
  providers,
}: AuthConfig<GeneratedListTypes>) {
  // The protectIdentities flag is currently under review to see whether it should be
  // part of the createAuth API (in which case its use cases need to be documented and tested)
  // or whether always being true is what we want, in which case we can refactor our code
  // to match this. -TL
  const protectIdentities = true;
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
  const pageMiddleware: AdminUIConfig['pageMiddleware'] = async ({
    context,
    isValidSession,
  }) => {
    const { req, session } = context;
    const pathname = url.parse(req?.url!).pathname!;

    if (isValidSession) {
      if (pathname === '/api/auth/signin') {
        return { kind: 'redirect', to: '/' };
      }
      return;
    } 

    if (!session && !pathname.includes('/api/auth/') ) {
        return { kind: 'redirect', to: `/api/auth/signin` };
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
   //const pkgDir = Path.dirname(require.resolve('@keystone-next/nextjs-auth/package.json'));
   const getAdditionalFiles = () => {
    let filesToWrite: AdminFileToWrite[] = [
      {
        mode: 'write',
        outputPath: 'pages/api/auth/[...nextauth].js',
        src: authTemplate({ gqlNames, identityField, providers, sessionData, listKey }),
      },
      {
        mode: 'write',
        outputPath: 'next.config.js',
        src: nextConfigTemplate(),
      }
    ];
    return filesToWrite;
  };

  /**
   * publicAuthPages
   *
   * Must be added to the ui.publicPages config
   */
  const publicPages = ['/api/auth/csrf','/api/auth/signin','/api/auth/signin/auth0', '/api/auth/callack','/api/auth/callback/auth0','/api/auth/session','/api/auth/providers', '/api/auth/signout'];


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
  }

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
    ): SessionStrategy<{ listKey: string; itemId: string; data: any }> => {
      const { get, ...sessionStrategy } = _sessionStrategy;
      return {
        ...sessionStrategy,
        get: async ({ req, createContext }) => {
          const sudoContext = createContext({}).sudo();
          const pathname = url.parse(req?.url!).pathname!;
          console.log("get Session Pathname", pathname);
          if (pathname.includes('/api/auth')){
            console.log("returning");
            return
          } 
          const nextSession = await getSession({ req });
          if (!nextSession){
            return
          } else {
            return nextSession;
          }
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
  const withAuth = (keystoneConfig: KeystoneConfig): KeystoneConfig => {
    validateConfig(keystoneConfig);
    let ui = keystoneConfig.ui;
    if (keystoneConfig.ui) {
      ui = {
        ...keystoneConfig.ui,
        publicPages: [...(keystoneConfig.ui.publicPages || []), ...publicPages],
        getAdditionalFiles: [...(keystoneConfig.ui.getAdditionalFiles || []), getAdditionalFiles],
        pageMiddleware: async args =>
          (await pageMiddleware(args)) ?? keystoneConfig?.ui?.pageMiddleware?.(args),
        enableSessionItem: true,
        isAccessAllowed: async (context: KeystoneContext) => {
          // Allow access to the adminMeta data from the /init path to correctly render that page
          // even if the user isn't logged in (which should always be the case if they're seeing /init)
          const headers = context.req?.headers;
          const host = headers ? headers['x-forwarded-host'] || headers['host'] : null;
          const url = headers?.referer ? new URL(headers.referer) : undefined;
          const accessingInitPage =
            url?.pathname === '/init' &&
            url?.host === host &&
            (await context.sudo().lists[listKey].count({})) === 0;
          return (
            accessingInitPage || 
            (keystoneConfig.ui?.isAccessAllowed
              ? keystoneConfig.ui.isAccessAllowed(context)
              : context.session !== undefined)
          );
        },
      };
    }
    let session = keystoneConfig.session;
    if (session && sessionData) {
      session = withItemData(session);
    }
    const existingExtendGraphQLSchema = keystoneConfig.extendGraphqlSchema;
    const listConfig = keystoneConfig.lists[listKey];
    return {
      ...keystoneConfig,
      ui,
      session,
      lists: {
        ...keystoneConfig.lists,
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
