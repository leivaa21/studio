import { NextApiRequest, NextApiResponse } from 'next';

import { RenameUserRequest } from '@studio/commons';

import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { AuthApiService } from '../../../contexts/shared/infrastructure/ApiClients/AuthApiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      await renameUser(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function renameUser(req: NextApiRequest, res: NextApiResponse) {
  const authToken = req.headers.authorization;

  const { body } = req;

  const authApiService = new AuthApiService();

  const request: RenameUserRequest = {
    nickname: body.nickname,
  };

  await SafeControllerHandling(res, async () => {
    const response = await authApiService.put<RenameUserRequest, void>(
      `/user/nickname`,
      request,
      authToken
    );

    res.status(200).send(response);
  });
}
