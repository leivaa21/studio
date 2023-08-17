import { GetUserInfoResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getUserInfoById(
  userId: string
): Promise<GetUserInfoResponse> {
  const response = await internalApiClient.get<GetUserInfoResponse>(
    `/api/user/${userId}`
  );

  return response;
}
