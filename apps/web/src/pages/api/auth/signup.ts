import { NextApiRequest, NextApiResponse } from "next";
import { SignUpRequest } from '@studio/commons/dist/contracts/auth/SignUpContracts';
import { GetUserResponse } from '@studio/commons/dist/contracts/user/GetUserContracts';
import { AuthApiService } from "../../../contexts/shared/infrastructure/ApiClients/AuthApiService";
import { SafeControllerHandling } from "../../../lib/controllers/SafeControllerHandling";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method !== 'POST') {

    return  res.status(404).json({ status: 404, message: `Cannot ${req.method} ${req.url}` })
  }

  const authApiService = new AuthApiService();

  const { body } = req;

  const request: SignUpRequest = {
    nickname: body.nickname,
    credentials: {
      email: body.credentials.email,
      password: body.credentials.password,
    }
  }

  await SafeControllerHandling(res, async () => {
    const signupResponse = await authApiService.post<SignUpRequest, {message: string, token: string}>(`/auth/signup/basic`, request)

    const { token } = signupResponse;
    
    const params = new Map([
      ['email', body.credentials.email]
    ])
  
    const user = await authApiService.get<GetUserResponse>('/auth/me', params, token);
  
    return res.status(201).send({user, token})
  })

}