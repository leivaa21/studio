import { NextApiRequest, NextApiResponse } from 'next';
import { SafeControllerHandling } from '../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';
import { CreateCourseSubscriptionRequest } from '@studio/commons';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      await createCourseSubscription(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function createCourseSubscription(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authToken = req.headers.authorization;

  const coursesApiService = new CoursesApiService();

  const { body } = req;

  const request: CreateCourseSubscriptionRequest = {
    courseId: body.courseId,
  };

  await SafeControllerHandling(res, async () => {
    await coursesApiService.post<CreateCourseSubscriptionRequest, void>(
      '/course-subscriptions',
      request,
      authToken
    );

    res.status(201).end();
  });
}
