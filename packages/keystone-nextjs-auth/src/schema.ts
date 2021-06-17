import { mergeSchemas } from '@graphql-tools/merge';
import { ExtendGraphqlSchema } from '@keystone-next/types';

import { AuthGqlNames, AuthTokenTypeConfig, InitFirstItemConfig } from './types';
import { getBaseAuthSchema } from './gql/getBaseAuthSchema';
import { getInitFirstItemSchema } from './gql/getInitFirstItemSchema';

export const getSchemaExtension = ({
  identityField,
  listKey,
  gqlNames,

}: {
  identityField: string;
  listKey: string;
  gqlNames: AuthGqlNames;
}): ExtendGraphqlSchema => (schema) =>
  [
    getBaseAuthSchema({
      listKey,
      gqlNames,
    }),
  ]
    .filter(x => x)
    .reduce((s, extension) => mergeSchemas({ schemas: [s], ...extension }), schema);
