import { AuthTokenRequestErrorCode } from '../types';

export async function findMatchingIdentity(
  identityField: string,
  identity: string | number,
  queryAPI: any
): Promise<
  | { success: false; code: AuthTokenRequestErrorCode }
  | { success: true; item: any }
> {
  const item = await queryAPI.findOne({
    where: { [identityField]: identity },
  });
  // Identity failures with helpful errors
  let code: AuthTokenRequestErrorCode | undefined;
  if (!item) {
    code = 'IDENTITY_NOT_FOUND';
  }
  if (code) {
    return { success: false, code };
  }
  return { success: true, item };
}
