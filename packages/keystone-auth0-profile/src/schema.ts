import { mergeSchemas } from '@graphql-tools/merge';
import { ExtendGraphqlSchema } from '@keystone-next/types';

import { AuthGqlNames } from './types';
import { getBaseAuthSchema } from './gql/getBaseAuthSchema';

export const getSchemaExtension =
  ({
    identityField,
    listKey,
    gqlNames,
  }: {
    identityField: string;
    listKey: string;
    gqlNames: AuthGqlNames;
  }): ExtendGraphqlSchema =>
  (schema) =>
    [
      getBaseAuthSchema({
        listKey,
        gqlNames,
      }),
    ]
      .filter((x) => x)
      .reduce(
        (s, extension) => mergeSchemas({ schemas: [s], ...extension }),
        schema
      );
