import type {
  GraphQLSchemaExtension,
  KeystoneContext,
} from '@keystone-next/keystone/types';

import { AuthGqlNames } from '../types';

export function getBaseAuthSchema<I extends string, S extends string>({
  listKey,
  gqlNames,
}: {
  listKey: string;
  gqlNames: AuthGqlNames;
}): GraphQLSchemaExtension {
  return {
    typeDefs: `
      # Auth
      union AuthenticatedItem = ${listKey}
      type Query {
        authenticatedItem: AuthenticatedItem
      }
    `,
    resolvers: {
      Query: {
        async authenticatedItem(root, args, { session, query }: KeystoneContext) {
          if (
            typeof session?.itemId === 'string' &&
            typeof session.listKey === 'string'
          ) {
            try {
              return query[session.listKey].findOne({
                where: { id: session.itemId },
                resolveFields: false,
              });
            } catch (e) {
              return null;
            }
          }
          return null;
        },
      },
      AuthenticatedItem: {
        __resolveType(rootVal: any, { session }: KeystoneContext) {
          return session?.listKey;
        },
      },
      // TODO: Is this the preferred approach for this?
      [gqlNames.ItemAuthenticationWithPasswordResult]: {
        __resolveType(rootVal: any) {
          return rootVal.sessionToken
            ? gqlNames.ItemAuthenticationWithPasswordSuccess
            : gqlNames.ItemAuthenticationWithPasswordFailure;
        },
      },
    },
  };
}
