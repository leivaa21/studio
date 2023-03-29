import { NextApiRequest, NextApiResponse } from 'next';
import { SignInRequest } from '@studio/commons/dist/contracts/auth/SignInContracts';
import { AuthorizationResponse } from '@studio/commons/dist/contracts/auth/AuthorizationResponse';
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

  const request: SignInRequest = {
    email: body.email,
    password: body.password,
  };

  await SafeControllerHandling(res, async () => {
    const response = await authApiService.post<
      SignInRequest,
      AuthorizationResponse
    >(`/auth/signin/basic`, request);

    return res.status(201).send(response);
  });
}
