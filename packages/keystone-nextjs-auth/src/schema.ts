import { ExtendGraphqlSchema } from '@keystone-6/core/types';

import { graphql } from '@keystone-6/core';
import { getBaseAuthSchema } from './gql/getBaseAuthSchema';

export const getSchemaExtension = ({
  listKey,
}: {
  identityField: string;
  listKey: string;
}): ExtendGraphqlSchema =>
  graphql.extend((base) => {
    const baseSchema = getBaseAuthSchema({
      listKey,
      base,
    });

    return [baseSchema.extension].filter(
      (x): x is Exclude<typeof x, undefined> => x !== undefined
    );
  });
