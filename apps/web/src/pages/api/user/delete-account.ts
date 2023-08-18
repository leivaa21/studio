import { NextApiRequest, NextApiResponse } from 'next';

import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { AuthApiService } from '../../../contexts/shared/infrastructure/ApiClients/AuthApiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'DELETE':
      await deleteAccount(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function deleteAccount(req: NextApiRequest, res: NextApiResponse) {
  const authToken = req.headers.authorization;

  const authApiService = new AuthApiService();

  await SafeControllerHandling(res, async () => {
    await authApiService.delete<undefined, void>(
      `/delete-account`,
      undefined,
      authToken
    );

    res.status(200).end();
  });
}
