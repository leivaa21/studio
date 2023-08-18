import { internalApiClient } from '../../../lib/InternalApiClient';

export async function deleteAccount(authorizationToken: string) {
  await internalApiClient.delete<undefined, void>(
    `/api/user/delete-account`,
    undefined,
    authorizationToken
  );
}
