import { NextApiRequest, NextApiResponse } from 'next';
import { SignUpRequest } from '@studio/commons';
import { AuthorizationResponse } from '@studio/commons';
import { AuthApiService } from '../../../contexts/shared/infrastructure/ApiClients/AuthApiService';
import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res
      .status(404)
      .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }

  const authApiService = new AuthApiService();

  const { body } = req;

  const request: SignUpRequest = {
    nickname: body.nickname,
    credentials: {
      email: body.credentials.email,
      password: body.credentials.password,
    },
  };

  await SafeControllerHandling(res, async () => {
    const response = await authApiService.post<
      SignUpRequest,
      AuthorizationResponse
    >(`/auth/signup/basic`, request);

    return res.status(201).send(response);
  });
}
