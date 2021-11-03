import type { ItemRootValue } from '@keystone-next/keystone/types';
import { graphql } from '@keystone-next/keystone';

import { AuthGqlNames } from '../types';

export function getBaseAuthSchema({
  listKey,
  gqlNames,
  base,
}: {
  listKey: string;
  gqlNames: AuthGqlNames;
  base: graphql.BaseSchemaMeta;
}) {
  const extension = {
    query: {
      authenticatedItem: graphql.field({
        type: graphql.union({
          name: 'AuthenticatedItem',
          types: [base.object(listKey) as graphql.ObjectType<ItemRootValue>],
          resolveType: (root, context) => context.session?.listKey,
        }),
        resolve(root, args, { session, db }) {
          if (
            typeof session?.itemId === 'string' &&
            typeof session.listKey === 'string'
          ) {
            return db[session.listKey].findOne({
              where: { id: session.itemId },
            });
          }
          return null;
        },
      }),
    },
  };
  return { extension };
}
