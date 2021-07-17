import type { KeystoneListsAPI } from '@keystone-next/types';

import { AuthTokenRequestErrorCode } from '../types';

export async function findMatchingIdentity(
  identityField: string,
  identity: string,
  itemAPI: KeystoneListsAPI<any>[string]
): Promise<
  | { success: false; code: AuthTokenRequestErrorCode }
  | { success: true; item: any }
> {
  const item = await itemAPI.findOne({
    where: { [identityField]: identity },
    resolveFields: false,
  });
  console.log(item);

  // Identity failures with helpful errors
  let code: AuthTokenRequestErrorCode | undefined;
  if (item.length === 0) {
    code = 'IDENTITY_NOT_FOUND';
  } else if (item.length > 1) {
    code = 'MULTIPLE_IDENTITY_MATCHES';
  }
  if (code) {
    return { success: false, code };
  }
  return { success: true, item };
}
