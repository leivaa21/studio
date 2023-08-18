import { RenameUserRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function renameUser(
  request: RenameUserRequest,
  authorizationToken: string
) {
  await internalApiClient.put<RenameUserRequest, void>(
    `/api/user/nickname`,
    request,
    authorizationToken
  );
}
