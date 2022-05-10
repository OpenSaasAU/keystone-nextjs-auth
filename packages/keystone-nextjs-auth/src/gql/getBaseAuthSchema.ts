import type { BaseItem } from '@keystone-6/core/types';
import { graphql } from '@keystone-6/core';

export function getBaseAuthSchema({
  listKey,
  base,
}: {
  listKey: string;
  base: graphql.BaseSchemaMeta;
}) {
  const extension = {
    query: {
      authenticatedItem: graphql.field({
        type: graphql.union({
          name: 'AuthenticatedItem',
          types: [base.object(listKey) as graphql.ObjectType<BaseItem>],
          resolveType: (root, context) => context.session?.listKey,
        }),
        resolve(root, args, { session, db }) {
          if (typeof session?.itemId === 'string' && typeof session.listKey === 'string') {
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
