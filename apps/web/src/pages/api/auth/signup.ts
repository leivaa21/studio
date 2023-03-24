import { NextApiRequest, NextApiResponse } from "next";
import { SignUpRequest } from '@studio/commons/dist/contracts/auth/SignUpContracts';
import { AuthApiService } from "../../../contexts/shared/infrastructure/ApiClients/AuthApiService";
import { error } from "@studio/api-utils/loggers/console";
import { ErrorCodes } from "@studio/commons/dist/errors/ErrorCodes";

interface GetUserResponse {
  id: string;
}

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

  await authApiService.post<SignUpRequest, void>(`/users/singup/basic`, request)

  const params = new Map([
    ['email', body.credentials.email]
  ])

  try {
    const user = await authApiService.get<GetUserResponse>('/usessr', params);

    console.log(user);
  
    res.status(200).send({})
  }
  catch(someError) {
    if(typeof someError === 'string') {
      error(someError)
      res.status(500).send({
        apiStatus: 500,
        message: 'Unhandled Error',
        errorCode: ErrorCodes.InternalServerError
      })
    }
    if(typeof someError === 'object' && someError && (someError as {message: string}).message) {
      error((someError as {message: string}).message)
    }
    console.log(someError)
  }
}