import { NextApiRequest, NextApiResponse } from 'next';
import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';
import {
  CreateCourseRequest,
  CreateCourseResponse,
  GetUserResponse,
} from '@studio/commons';
import { AuthApiService } from '../../../contexts/shared/infrastructure/ApiClients/AuthApiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res
      .status(404)
      .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }

  const authToken = req.headers.authorization;

  const coursesApiService = new CoursesApiService();
  const authApiService = new AuthApiService();

  const { body } = req;

  await SafeControllerHandling(res, async () => {
    const user = await authApiService.get<GetUserResponse>(
      '/auth/me',
      undefined,
      authToken
    );
    const request: CreateCourseRequest = {
      title: body.title,
      description: body.description,
      authorId: user.id,
    };

    const response = await coursesApiService.post<
      CreateCourseRequest,
      CreateCourseResponse
    >('/courses', request, authToken);

    res.status(201).send(response);
  });
}
