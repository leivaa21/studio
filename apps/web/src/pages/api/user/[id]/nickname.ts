import { NextApiRequest, NextApiResponse } from 'next';

import { GetUserNicknameResponse } from '@studio/commons';

import { SafeControllerHandling } from '../../../../lib/controllers/SafeControllerHandling';
import { AuthApiService } from '../../../../contexts/shared/infrastructure/ApiClients/AuthApiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getUserNickname(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function getUserNickname(req: NextApiRequest, res: NextApiResponse) {
  const { id: userId } = req.query;

  const authApiService = new AuthApiService();

  await SafeControllerHandling(res, async () => {
    const response = await authApiService.get<GetUserNicknameResponse>(
      `/user/${userId}/nickname`
    );

    res.status(200).send(response);
  });
}
