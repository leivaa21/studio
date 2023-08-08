import { NextApiRequest, NextApiResponse } from 'next';
import { SafeControllerHandling } from '../../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';
import { CourseSubscriptionInfoResponse } from '@studio/commons';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'GET':
      await getOwnedCourseSubscriptionByCourseId(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function getOwnedCourseSubscriptionByCourseId(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authToken = req.headers.authorization;

  const coursesApiService = new CoursesApiService();

  const { courseId } = req.query;

  await SafeControllerHandling(res, async () => {
    const response =
      await coursesApiService.get<CourseSubscriptionInfoResponse>(
        `/course-subscription/${courseId}`,
        undefined,
        authToken
      );

    res.status(200).send(response);
  });
}
