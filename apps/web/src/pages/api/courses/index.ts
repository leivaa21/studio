import { NextApiRequest, NextApiResponse } from 'next';
import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';
import { CreateCourseRequest } from '@studio/commons';

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

  const { body } = req;

  const request: CreateCourseRequest = {
    title: body.title,
    description: body.description,
  };

  await SafeControllerHandling(res, async () => {
    await coursesApiService.post<CreateCourseRequest, void>(
      '/courses',
      request,
      authToken
    );

    res.status(201).end();
  });
}
