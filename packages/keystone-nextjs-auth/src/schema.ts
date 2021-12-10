import { ExtendGraphqlSchema } from '@keystone-6/core/types';

import { assertInputObjectType, GraphQLString, GraphQLID } from 'graphql';
import { graphql } from '@keystone-6/core';
import { AuthGqlNames } from './types';
import { getBaseAuthSchema } from './gql/getBaseAuthSchema';

export const getSchemaExtension = ({
  identityField,
  listKey,
  gqlNames,
}: {
  identityField: string;
  listKey: string;
  gqlNames: AuthGqlNames;
}): ExtendGraphqlSchema =>
  graphql.extend((base) => {
    const uniqueWhereInputType = assertInputObjectType(
      base.schema.getType(`${listKey}WhereUniqueInput`)
    );
    const identityFieldOnUniqueWhere =
      uniqueWhereInputType.getFields()[identityField];
    if (
      identityFieldOnUniqueWhere?.type !== GraphQLString &&
      identityFieldOnUniqueWhere?.type !== GraphQLID
    ) {
      throw new Error(
        `createAuth was called with an identityField of ${identityField} on the list ${listKey} ` +
          `but that field doesn't allow being searched uniquely with a String or ID. ` +
          `You should likely add \`isIndexed: 'unique'\` ` +
          `to the field at ${listKey}.${identityField}`
      );
    }
    const baseSchema = getBaseAuthSchema({
      listKey,
      gqlNames,
      base,
    });

    return [baseSchema.extension].filter(
      (x): x is Exclude<typeof x, undefined> => x !== undefined
    );
  });
