import { ChangeEmailRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function changeEmail(
  request: ChangeEmailRequest,
  authorizationToken: string
) {
  await internalApiClient.put<ChangeEmailRequest, void>(
    `/api/user/email`,
    request,
    authorizationToken
  );
}
