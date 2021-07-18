import url from 'url';
import {
  AdminFileToWrite,
  BaseGeneratedListTypes,
  KeystoneConfig,
  KeystoneContext,
  AdminUIConfig,
  SessionStrategy,
} from '@keystone-next/types';
import {
  createAuth,
  nextAuthProviders as Providers,
} from '@opensaas/keystone-nextjs-auth';
// import * as Path from 'path';
import { profileTemplate } from './templates/profile';
import { ProfileConfig } from './types';

export const nextAuthProviders = Providers;
/**
 * auth0Profile function
 *
 * Generates config for Keystone to implement auth0 profile features.
 */

export function auth0Profile<
  GeneratedListTypes extends BaseGeneratedListTypes
>({
  listKey,
  identityField,
  sessionData,
  autoCreate,
  userMap,
  accountMap,
  profileMap,
  keystonePath,
  profilePageName,
}: ProfileConfig<GeneratedListTypes>) {
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

    const identityFieldConfig = listConfig.fields[identityField];
    if (identityFieldConfig === undefined) {
      const i = JSON.stringify(identityField);
      const msg = `A createAuth() invocation for the "${listKey}" list specifies ${i} as its identityField but no field with that key exists on the list.`;
      throw new Error(msg);
    }
  };

  const getAdditionalFiles = () => {
    const filesToWrite: AdminFileToWrite[] = [
      {
        mode: 'write',
        outputPath: `pages/${profilePageName}.js`,
        src: profileTemplate({ listKey }),
      },
    ];
    return filesToWrite;
  };

  const auth = createAuth({
    listKey,
    identityField,
    sessionData,
    autoCreate,
    userMap,
    accountMap,
    profileMap,
    keystonePath,
  });

  /**
   * withProfile
   *
   * Automatically extends config with the correct auth functionality. This is the easiest way to
   * configure auth for keystone; you should probably use it unless you want to extend or replace
   * the way auth is set up with custom functionality.
   *
   * It validates the auth config against the provided keystone config, and preserves existing
   * config by composing existing extendGraphqlSchema functions and ui config.
   */
  const withProfile = (keystoneConfig: KeystoneConfig): KeystoneConfig => {
    validateConfig(keystoneConfig);
    let { ui } = keystoneConfig;
    if (keystoneConfig.ui) {
      ui = {
        ...keystoneConfig.ui,
        getAdditionalFiles: [
          ...(keystoneConfig.ui.getAdditionalFiles || []),
          getAdditionalFiles,
        ],
      };
    }

    return auth.withAuth({
      ...keystoneConfig,
      ui,
      lists: {
        ...keystoneConfig.lists,
        [listKey]: {
          ...keystoneConfig.lists[listKey],
        },
      },
    });
  };

  return {
    withProfile,
    // In the future we may want to return the following so that developers can
    // roll their own. This is pending a review of the use cases this might be
    // appropriate for, along with documentation and testing.
    // ui: { enableSessionItem: true, pageMiddleware, getAdditionalFiles, publicPages },
    // fields,
    // extendGraphqlSchema,
    // validateConfig,
  };
}
