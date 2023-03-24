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
    await authApiService.post<SignUpRequest, void>(`/users/singup/basic`, request)

    const params = new Map([
      ['email', body.credentials.email]
    ])
  
    const user = await authApiService.get<GetUserResponse>('/user', params);
  
    return res.status(201).send(user)
  })

}