import { NextApiRequest, NextApiResponse } from 'next';

import {
  CurrentAuthorStatsResponse,
  CurrentConsumerStatsResponse,
} from '@studio/commons';

import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getUserStats(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function getUserStats(req: NextApiRequest, res: NextApiResponse) {
  const coursesApiService = new CoursesApiService();

  const authToken = req.headers.authorization;

  await SafeControllerHandling(res, async () => {
    const { hasConsumerStats } = await coursesApiService.get<{
      hasConsumerStats: boolean;
    }>(`/has-consumer-stats`, undefined, authToken);
    const { hasAuthorStats } = await coursesApiService.get<{
      hasAuthorStats: boolean;
    }>(`/has-author-stats`, undefined, authToken);

    const userStats: {
      consumerStats?: CurrentConsumerStatsResponse;
      authorStats?: CurrentAuthorStatsResponse;
    } = {
      consumerStats: undefined,
      authorStats: undefined,
    };

    if (hasConsumerStats) {
      const stats = await coursesApiService.get<CurrentConsumerStatsResponse>(
        '/consumer-stats',
        undefined,
        authToken
      );
      userStats.consumerStats = stats;
    }
    if (hasAuthorStats) {
      const stats = await coursesApiService.get<CurrentAuthorStatsResponse>(
        '/author-stats',
        undefined,
        authToken
      );
      userStats.authorStats = stats;
    }

    res.status(200).send(userStats);
  });
}
