import { NextApiRequest, NextApiResponse } from 'next';

import { UpdateCourseRequest } from '@studio/commons';

import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res
      .status(404)
      .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }

  const { id: courseId } = req.query;

  const authToken = req.headers.authorization;

  const { body } = req;

  const coursesApiService = new CoursesApiService();

  const request: UpdateCourseRequest = {
    title: body.title,
    tags: body.tags,
    description: body.description,
  };

  await SafeControllerHandling(res, async () => {
    await coursesApiService.put<UpdateCourseRequest, void>(
      `/course/${courseId}`,
      request,
      authToken
    );

    res.status(200).end();
  });
}
