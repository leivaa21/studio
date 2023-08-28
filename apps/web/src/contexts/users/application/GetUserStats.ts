import {
  CurrentAuthorStatsResponse,
  CurrentConsumerStatsResponse,
} from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export interface GetUserStatsResponse {
  consumerStats?: CurrentConsumerStatsResponse;
  authorStats?: CurrentAuthorStatsResponse;
}

export async function getUserStats(
  token: string
): Promise<GetUserStatsResponse> {
  const response = await internalApiClient.get<GetUserStatsResponse>(
    '/api/user/stats',
    undefined,
    token
  );

  return response;
}
