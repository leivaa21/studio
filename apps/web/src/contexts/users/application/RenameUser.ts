import { RenameUserRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function renameCourse(
  request: RenameUserRequest,
  authorizationToken: string
) {
  await internalApiClient.put<RenameUserRequest, void>(
    `/api/user/nickname`,
    request,
    authorizationToken
  );
}
