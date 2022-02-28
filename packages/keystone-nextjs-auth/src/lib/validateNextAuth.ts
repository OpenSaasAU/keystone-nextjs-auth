import type { KeystoneListsAPI } from '@keystone-6/core/types';
import { NextAuthErrorCode } from '../types';
import { findMatchingIdentity } from './findMatchingIdentity';

export async function validateNextAuth(
  identityField: string,
  identity: string | number,
  protectIdentities: boolean,
  itemAPI: KeystoneListsAPI<any>[string]
): Promise<
  | { success: false; code: NextAuthErrorCode }
  | { success: true; item: { id: any; [prop: string]: any } }
> {
  const match = await findMatchingIdentity(identityField, identity, itemAPI);

  const { item } = match as {
    success: true;
    item: { id: any; [prop: string]: any };
  };

  if (item) {
    return { success: true, item };
  }
  return {
    success: false,
    code: protectIdentities ? 'FAILURE' : 'SUBJECT_NOT_FOUND',
  };
}
