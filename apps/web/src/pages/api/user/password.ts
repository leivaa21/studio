import { NextApiRequest, NextApiResponse } from 'next';

import { ChangePasswordRequest } from '@studio/commons';

import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { AuthApiService } from '../../../contexts/shared/infrastructure/ApiClients/AuthApiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      await changePassword(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function changePassword(req: NextApiRequest, res: NextApiResponse) {
  const authToken = req.headers.authorization;

  const { body } = req;

  const authApiService = new AuthApiService();

  const request: ChangePasswordRequest = {
    oldPassword: body.oldPassword,
    newPassword: body.newPassword,
  };

  await SafeControllerHandling(res, async () => {
    const response = await authApiService.put<ChangePasswordRequest, void>(
      `/user/password`,
      request,
      authToken
    );

    res.status(200).send(response);
  });
}
