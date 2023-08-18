import { ChangePasswordRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function changePassword(
  request: ChangePasswordRequest,
  authorizationToken: string
) {
  await internalApiClient.put<ChangePasswordRequest, void>(
    `/api/user/password`,
    request,
    authorizationToken
  );
}
