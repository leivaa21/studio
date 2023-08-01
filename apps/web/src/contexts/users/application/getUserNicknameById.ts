import { GetUserNicknameResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getUserNicknameById(
  userId: string
): Promise<GetUserNicknameResponse> {
  const response = await internalApiClient.get<GetUserNicknameResponse>(
    `/api/user/${userId}`
  );

  return response;
}
