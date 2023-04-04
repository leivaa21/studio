import { GetUserResponse } from '@studio/commons';
import { NextApiRequest, NextApiResponse } from 'next';
import { AuthApiService } from '../../../contexts/shared/infrastructure/ApiClients/AuthApiService';
import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res
      .status(404)
      .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }

  const authToken = req.headers.authorization;

  const authApiService = new AuthApiService();

  await SafeControllerHandling(res, async () => {
    const response = await authApiService.get<GetUserResponse>(
      '/auth/me',
      undefined,
      authToken
    );

    res.status(200).send(response);
  });
}
