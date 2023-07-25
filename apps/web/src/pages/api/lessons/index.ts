import { NextApiRequest, NextApiResponse } from 'next';
import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';
import { CreateLessonRequest } from '@studio/commons';

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

  const request: CreateLessonRequest = {
    courseId: body.courseId,
    title: body.title,
    content: body.content,
  };

  await SafeControllerHandling(res, async () => {
    await coursesApiService.post<CreateLessonRequest, void>(
      '/lessons',
      request,
      authToken
    );

    res.status(201).end();
  });
}
